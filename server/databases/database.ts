import { DataTypes, Model, Sequelize } from "sequelize";
import { OrderStatus } from "~/shared/enums/orderstatus.enum";
import { UserRole } from "~/shared/enums/userrole.enum";
import {
  IAddress,
  ICart,
  IOrder,
  IOrderItem,
  IProduct,
  IUser,
} from "~/types/entity";

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

  public static async syncRelations() {
    console.log("Syncing relations");
    await Address.sync({ alter: true });
    await User.sync({ alter: true });

    User.hasMany(Address);
    Address.belongsTo(User);

    console.log("Relations synced");
  }

  static createSQLite() {
    const sequelize = new Sequelize({
      dialect: "sqlite",
      storage: process.env.DB_STORAGE || "database.sqlite",
      logging: false,
    });

    return sequelize;
  }
}

export class Address extends Model<IAddress> implements IAddress {
  declare id: number;
  declare address: string;
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
    address: {
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

Address.sync({ force: true });

export class User extends Model<IUser> {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare address: Address;
  declare role: UserRole;

  // return as JSON without password
  // toJSON() {
  //   return {
  //     ...this.get(),
  //     password: undefined,
  //   };
  // }
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
    address: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    sequelize: DatabaseSingleton.getDatabase(),
  }
);

User.sync({ force: true });

export class Product extends Model<IProduct> {
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

Product.sync({ force: true });

export class OrderItem extends Model<IOrderItem> implements IOrderItem {
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
    product: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

OrderItem.sync({ force: true });

export class Cart extends Model<ICart> {
  declare id: number;
  declare userId: number;

  // associations
  declare user: User;
  declare products: OrderItem[];
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    products: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "carts",
    sequelize: DatabaseSingleton.getDatabase(),
  }
);

Cart.belongsTo(User, { foreignKey: "userId", as: "F_userId" });
Cart.hasMany(OrderItem, { foreignKey: "cartId", as: "F_products" });

Cart.sync({ force: true });

export class Order extends Model<IOrder> implements IOrder {
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
    user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "orders",
    sequelize: DatabaseSingleton.getDatabase(),
  }
);

Order.belongsTo(User, { foreignKey: "userId", as: "f_user" });

Order.sync({ force: true });
