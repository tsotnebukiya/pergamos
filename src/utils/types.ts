import type { NextPage } from "next";
import type {
  FunctionComponent,
  ReactElement,
  ReactNode,
  SVGProps,
} from "react";

export type HeroIcon = FunctionComponent<
  SVGProps<SVGSVGElement> & React.RefAttributes<SVGSVGElement>
>;

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};
