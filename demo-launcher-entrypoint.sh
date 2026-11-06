#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

TARGET_DIR="${TARGET_DIR:-/opt/nuxtshop}"
REPO_URL="${REPO_URL:-https://github.com/wuttinanhi/nuxtshop.git}"
BRANCH="${BRANCH:-main}"

# Installs Docker CE and Docker Compose plugin on Debian/Ubuntu if not already present.
#
# Arguments:
#   None
#
# Example usage:
#   install_docker
install_docker() {
  if command -v docker &> /dev/null; then
    echo "Docker is already installed."
    return 0
  fi

  echo "Installing Docker..."
  apt-get update -y
  apt-get install -y ca-certificates curl gnupg git
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
  echo "Docker installation complete."
}

# Installs Node.js v20 LTS and pnpm on the host to run repository development scripts.
#
# Arguments:
#   None
#
# Example usage:
#   install_node_pnpm
install_node_pnpm() {
  if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
  fi

  if ! command -v pnpm &> /dev/null; then
    echo "Configuring pnpm..."
    corepack enable || true
    corepack prepare pnpm@latest --activate 2>/dev/null || npm install -g pnpm
  fi
}

# Queries host public IPv4 address using DigitalOcean metadata service with internet fallback.
#
# Arguments:
#   None
#
# Output:
#   Writes the detected IP address to standard output.
#
# Example usage:
#   public_ip="$(get_public_ip)"
get_public_ip() {
  local ip
  ip="$(curl -s --connect-timeout 5 http://169.254.169.254/metadata/v1/interfaces/public/0/ipv4/address 2>/dev/null || true)"
  if [ -z "$ip" ]; then
    ip="$(curl -s --connect-timeout 5 https://api.ipify.org 2>/dev/null || curl -s --connect-timeout 5 https://ifconfig.me 2>/dev/null || true)"
  fi
  echo "$ip"
}

# Polls PostgreSQL until the database service accepts client connections.
#
# Arguments:
#   $1 - max_retries: Maximum number of polling attempts (default: 60)
#   $2 - interval_seconds: Sleep interval between attempts in seconds (default: 2)
#
# Example usage:
#   wait_for_postgres 60 2
wait_for_postgres() {
  local max_retries="${1:-60}"
  local interval_seconds="${2:-2}"
  local count=0

  echo "Waiting for postgres to become ready..."
  until docker compose exec -T db pg_isready -U mynuxtshop -d mynuxtshop; do
    count=$((count + 1))
    if [ "$count" -ge "$max_retries" ]; then
      echo "Error: PostgreSQL did not become ready within $((max_retries * interval_seconds)) seconds." >&2
      return 1
    fi
    sleep "$interval_seconds"
  done
  echo "PostgreSQL is ready."
}

# Orchestrates droplet startup: provisioning dependencies, repository cloning,
# configuration synchronization, container launch, and mock seeding.
#
# Arguments:
#   None
#
# Example usage:
#   main
main() {
  install_docker
  install_node_pnpm

  if [ -f "template.env" ]; then
    echo "Running inside repository directory."
  else
    if [ ! -d "$TARGET_DIR" ]; then
      echo "Cloning repository from $REPO_URL (branch: $BRANCH) into $TARGET_DIR..."
      git clone --branch "$BRANCH" "$REPO_URL" "$TARGET_DIR"
    fi
    cd "$TARGET_DIR"
  fi

  echo "Setting up .env file..."
  cp -f template.env .env

  local public_ip
  public_ip="$(get_public_ip)"
  if [ -n "$public_ip" ]; then
    echo "Updating .env payment callback URLs with droplet public IP: $public_ip"
    sed -i "s|http://localhost:3000|http://${public_ip}:3000|g" .env
  else
    echo "Warning: Unable to resolve public IP; keeping localhost for payment callback URLs."
  fi

  echo "Installing project dependencies..."
  pnpm install

  echo "Starting docker compose services..."
  docker compose up -d

  wait_for_postgres 60 2

  echo "Running database mock seed..."
  chmod +x ./dev-mock.sh
  ./dev-mock.sh

  echo "Demo launcher completed successfully."
}

main "$@"
