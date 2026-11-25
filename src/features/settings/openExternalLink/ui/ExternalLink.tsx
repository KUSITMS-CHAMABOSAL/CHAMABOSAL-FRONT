import type { ComponentProps, MouseEvent, ReactNode } from "react";

import { Paragraph } from "@toss/tds-mobile";

import { openExternalUrl } from "@/shared/lib/appsInToss";

type LinkProps = ComponentProps<typeof Paragraph.Link>;

interface ExternalLinkProps {
  /** `https://`나 `mailto:`로 시작하는 주소예요. */
  href: string;
  /** 링크는 둘레 문단의 글자 스타일을 물려받지 않아서 같은 값을 넘겨요. 색의 TDS 기본은 파란색이에요. */
  typography: LinkProps["typography"];
  fontWeight: LinkProps["fontWeight"];
  color: string;
  children: ReactNode;
}

/** 문단 속 외부 주소예요(`Paragraph` 안에 둬요). 누르면 토스 밖에서 열려요. 밑줄로 구분해요. */
const ExternalLink = ({ href, typography, fontWeight, color, children }: ExternalLinkProps) => (
  <Paragraph.Link
    as="a"
    type="underline"
    href={href}
    typography={typography}
    fontWeight={fontWeight}
    color={color}
    onClick={(event: MouseEvent) => {
      event.preventDefault();
      // 열지 못해도(지원하지 않는 앱 버전 등) 약관을 읽는 데는 문제가 없어 조용히 넘어가요.
      openExternalUrl(href).catch(() => {});
    }}
  >
    <Paragraph.Text>{children}</Paragraph.Text>
  </Paragraph.Link>
);

export default ExternalLink;
