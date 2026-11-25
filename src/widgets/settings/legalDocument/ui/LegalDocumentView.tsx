import { FixedBottomCTA, Paragraph, Top } from "@toss/tds-mobile";

import type { ReactNode } from "react";

import { ExternalLink } from "@/features/settings/openExternalLink";

import { LEGAL_LINKS } from "../config/links";
import type { LegalBlock, LegalDocument } from "../model/types";

/** 본문은 시안처럼 15px 세미볼드, 보조 글자색이에요. */
const BODY = {
  typography: "t6",
  fontWeight: "semibold",
  color: "var(--adaptiveGreyOpacity700)",
} as const;

const LINK_PATTERN = new RegExp(
  `(${Object.keys(LEGAL_LINKS)
    .map(text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
);

/**
 * 글 속 사이트 주소와 메일 주소를 링크로 바꿔요. 원문 글자는 그대로예요.
 * `Paragraph`는 문자열에만 글자 스타일을 입혀서, 링크와 섞이면 글자도 `Paragraph.Text`로 감싸요.
 */
const withLinks = (text: string): ReactNode[] =>
  text.split(LINK_PATTERN).map((part, index) => {
    const href = LEGAL_LINKS[part];
    return href ? (
      <ExternalLink key={index} href={href} {...BODY}>
        {part}
      </ExternalLink>
    ) : (
      <Paragraph.Text key={index}>{part}</Paragraph.Text>
    );
  });

const Block = ({ block }: { block: LegalBlock }) => {
  if (block.kind === "text") return <Paragraph {...BODY}>{withLinks(block.text)}</Paragraph>;
  const List = block.kind === "numbered" ? "ol" : "ul";
  return (
    // 기본 번호는 li 글꼴로 그려져 본문과 기준선이 어긋나서, 번호도 본문과 같은 글자로 그려요.
    // 기본 번호를 숨겨도 목록으로 읽히게 role을 붙여요.
    <List role="list" className="m-0! flex list-none flex-col gap-1 p-0!">
      {block.items.map((item, index) => (
        <li key={item} className="flex gap-1.5">
          <Paragraph {...BODY} className="shrink-0">
            {block.kind === "numbered" ? `${index + 1}.` : "•"}
          </Paragraph>
          <Paragraph {...BODY} className="min-w-0">
            {withLinks(item)}
          </Paragraph>
        </li>
      ))}
    </List>
  );
};

interface LegalDocumentViewProps {
  document: LegalDocument;
  onClose: () => void;
}

/** 이용약관과 개인정보처리방침이 함께 쓰는 본문이에요(시안 8-5). 조 제목은 본문보다 진하게 구분해요. */
const LegalDocumentView = ({ document, onClose }: LegalDocumentViewProps) => (
  <main className="min-h-svh bg-(--adaptiveBackground)">
    <Top
      title={
        <Top.TitleParagraph as="h1" size={28} color="var(--adaptiveGrey900)">
          {document.title}
        </Top.TitleParagraph>
      }
      subtitleBottom={
        <Top.SubtitleParagraph>{`시행일 ${document.effectiveDate}`}</Top.SubtitleParagraph>
      }
    />
    <div className="flex flex-col gap-6 px-6 pb-6">
      {document.preamble.map((block, index) => (
        <Block key={index} block={block} />
      ))}
      {document.sections.map(section => (
        <section key={section.title} className="flex flex-col gap-2">
          <Paragraph as="h2" typography="t6" fontWeight="bold" color="var(--adaptiveGrey900)">
            {section.title}
          </Paragraph>
          {section.blocks.map((block, index) => (
            <Block key={index} block={block} />
          ))}
        </section>
      ))}
    </div>
    <FixedBottomCTA color="dark" variant="weak" onClick={onClose}>
      닫기
    </FixedBottomCTA>
  </main>
);

export default LegalDocumentView;
