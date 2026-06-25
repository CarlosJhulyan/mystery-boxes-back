-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shipping_address" TEXT,
ADD COLUMN     "shipping_department" TEXT,
ADD COLUMN     "shipping_district" TEXT,
ADD COLUMN     "shipping_dni" TEXT,
ADD COLUMN     "shipping_name" TEXT,
ADD COLUMN     "shipping_province" TEXT,
ADD COLUMN     "shipping_reference" TEXT;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_url" TEXT,
    "tier" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BoxProduct" (
    "box_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "BoxProduct_pkey" PRIMARY KEY ("box_id","product_id")
);

-- AddForeignKey
ALTER TABLE "BoxProduct" ADD CONSTRAINT "BoxProduct_box_id_fkey" FOREIGN KEY ("box_id") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoxProduct" ADD CONSTRAINT "BoxProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
