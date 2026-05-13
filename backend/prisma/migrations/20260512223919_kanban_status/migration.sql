-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "isDoing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPriority" BOOLEAN NOT NULL DEFAULT false;
