import { DataTypes, Model, Sequelize } from "sequelize";
import { OrderStatus } from "~/shared/enums/orderstatus.enum";
import { UserRole } from "~/shared/enums/userrole.enum";
import { IOrderItem } from "~/types/entity";

export class DatabaseSingleton {
  declare static datasource: Sequelize;

  public static getDatabase() {
    if (!DatabaseSingleton.datasource) {
      switch (process.env.DB_TYPE) {
        case "mysql":
        // wait for implementation
        case "postgres":
        // wait for implementation
        default:
          DatabaseSingleton.datasource = DatabaseSingleton.createSQLite();
      }
    }

    return DatabaseSingleton.datasource;
  }

  static createSQLite() {
    const sequelize = new Sequelize({
      dialect: "sqlite",
      storage: process.env.DB_STORAGE || "database.sqlite",
      logging: false,
    });

    return sequelize;
  }

  public static async loadRelations() {
    User.hasOne(Address, { as: "address", foreignKey: "userId" });
    Address.belongsTo(User, { as: "user", foreignKey: "userId" });

    User.hasOne(Cart, { foreignKey: "userId" });
    Cart.belongsTo(User, { as: "user", foreignKey: "userId" });
    Cart.hasMany(OrderItem, { as: "items", foreignKey: "cartId" });
    OrderItem.belongsTo(Cart, { as: "cart", foreignKey: "cartId" });

    User.hasMany(Order, { foreignKey: "userId" });
    Order.belongsTo(User, { as: "user", foreignKey: "userId" });
    Order.belongsTo(Address, {
      as: "delivery_address",
      foreignKey: "addressId",
    });

    Order.hasMany(OrderItem, { as: "items", foreignKey: "orderId" });
    OrderItem.belongsTo(Order, { as: "order", foreignKey: "orderId" });

    Product.hasMany(OrderItem, { foreignKey: "productId" });
    OrderItem.belongsTo(Product, { as: "product", foreignKey: "productId" });
  }

  public static async sync() {
    console.log("Synchronizing models...");
    await this.datasource.drop();
    console.log("All tables dropped!");

    await this.datasource.sync({ force: true });

    console.log("Synchronizing models done!");
  }
}

export class Address extends Model {
  declare id: number;
  declare addressText: string;
  declare city: string;
  declare state: string;
  declare zip: string;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    addressText: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    city: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    state: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    zip: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    tableName: "addresses",
    sequelize: DatabaseSingleton.getDatabase(),
  }
);

export class User extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare addressId: number;
  declare role: UserRole;

  // associations
  declare address: Address;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      unique: true,
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    sequelize: DatabaseSingleton.getDatabase(),
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
  }
);

export class Product extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare price: number;
  declare imageURL?: string;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    imageURL: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
  },
  {
    tableName: "products",
    sequelize: DatabaseSingleton.getDatabase(),
  }
);

export class OrderItem extends Model implements IOrderItem {
  declare id: number;
  declare productId: number;
  declare quantity: number;

  // associations
  declare product: Product;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "orderitems",
    sequelize: DatabaseSingleton.getDatabase(),
  }
);

export class Cart extends Model {
  declare id: number;
  declare userId: number;

  // associations
  declare user: User;
  declare items: OrderItem[];
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  },
  {
    tableName: "carts",
    sequelize: DatabaseSingleton.getDatabase(),
  }
);

export class Order extends Model {
  declare id: number;
  declare userId: number;
  declare addressId: number;
  declare totalPrice: number;
  declare status: OrderStatus;

  // associations
  declare user: User;
  declare items: OrderItem[];
  declare address: Address;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    sequelize: DatabaseSingleton.getDatabase(),
  }
);
