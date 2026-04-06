-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Chef', 'Waiter', 'Cashier');

-- CreateEnum
CREATE TYPE "TableStatus" AS ENUM ('Available', 'Occupied');

-- CreateEnum
CREATE TYPE "SessionsStatus" AS ENUM ('Active', 'Closed');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Preparing', 'Ready', 'Served', 'Paid', 'Canceled');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tables" (
    "id" SERIAL NOT NULL,
    "qr_code_url" TEXT NOT NULL,
    "status" "TableStatus" NOT NULL,

    CONSTRAINT "Tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItems" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL,

    CONSTRAINT "MenuItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" SERIAL NOT NULL,
    "table_id" INTEGER NOT NULL,
    "status" "SessionsStatus" NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closed_at" TIMESTAMP(3),

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "id" SERIAL NOT NULL,
    "session_id" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'Pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItems" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "menu_item_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT,
    "price_at_time" INTEGER NOT NULL,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItems_name_key" ON "MenuItems"("name");

-- AddForeignKey
ALTER TABLE "MenuItems" ADD CONSTRAINT "MenuItems_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItems" ADD CONSTRAINT "OrderItems_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "MenuItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
