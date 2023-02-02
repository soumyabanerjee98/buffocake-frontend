import { Montserrat } from "@next/font/google";
import BasicLayout from "../projectComponents/UI/BasicLayout";
import "../styles/global.css";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={montserrat.className}>
        <BasicLayout>{children}</BasicLayout>
      </body>
    </html>
  );
}
