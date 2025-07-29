declare module "react-iframe" {
  interface IFrameProps {
    url: string;
    className?: string;
    [key: string]: any;
  }
  const IFrame: React.FC<IFrameProps>;
  export default IFrame;
}

declare module "react-icons/io5" {
  export const IoClose: React.FC<{ size?: number; [key: string]: any }>;
}

declare module "html2pdf.js" {
  const html2pdf: any;
  export default html2pdf;
}
