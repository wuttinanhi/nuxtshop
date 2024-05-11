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

  public static async sync() {
    console.log("Synchronizing models...");

    await this.datasource.drop();
    console.log("All tables dropped!");

    Address.belongsTo(User);

    User.hasOne(Address);
    User.hasMany(Order);
    User.hasOne(Cart);
    User.hasMany(Order);

    Cart.belongsTo(User);
    Cart.hasMany(OrderItem);

    Order.belongsTo(User);
    Order.belongsTo(Address);
    Order.hasMany(OrderItem);

    OrderItem.belongsTo(Product);
    OrderItem.belongsTo(Order);
    OrderItem.belongsTo(Cart);

    await this.datasource.sync({ force: true });
    console.log("All models were synchronized successfully.");

    console.log("Synchronizing models done!");

    // await Address.sync({ force: true });
    // await Address.sync({ force: true });
    // await User.sync({ force: true });
    // await Product.sync({ force: true });
    // await OrderItem.sync({ force: true });
    // await Cart.sync({ force: true });
    // await Order.sync({ force: true });
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
    // addressId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
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
    // productId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
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
    // userId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // addressId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
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
