declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.webp";
declare module "*.avif";
declare module "*.svg";
