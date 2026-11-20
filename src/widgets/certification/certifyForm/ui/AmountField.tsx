import { type CSSProperties, useEffect, useRef, useState } from "react";
import { NumberKeypad, TextField } from "@toss/tds-mobile";

import { SPENT_AMOUNT_MAX } from "@/entities/certification";
import { useSafeAreaBottom } from "@/shared/lib/appsInToss";

interface AmountFieldProps {
  /** 쓴 금액이에요. 비어 있으면 null이에요. */
  value: number | null;
  onChange: (value: number | null) => void;
}

const commaize = (value: number | null) => (value === null ? "" : value.toLocaleString("ko-KR"));

/** 숫자만 남겨 금액으로 바꿔요. 최대 금액을 넘으면 바꾸지 않아요. */
const toAmount = (digits: string, previous: number | null) => {
  if (digits === "") return null;
  const amount = Number(digits);
  return amount > SPENT_AMOUNT_MAX ? previous : amount;
};

/**
 * 쓴 금액 칸이에요. 시안처럼 기기 키보드 대신 TDS 숫자 키패드로 입력해요.
 * 칸을 누르면 키패드가 열리고, 칸과 키패드 밖을 누르면 닫히면서 스크롤을 처음으로 돌려요(시안 메모).
 * 키를 누르면 칸의 포커스가 빠져서 blur가 아니라 바깥 누르기로 닫아요.
 */
const AmountField = ({ value, onChange }: AmountFieldProps) => {
  const [isKeypadOpen, setIsKeypadOpen] = useState(false);
  const style = { "--safe-area-bottom": `${useSafeAreaBottom()}px` } as CSSProperties;
  const digits = value === null ? "" : String(value);

  const open = (field: HTMLElement) => {
    setIsKeypadOpen(true);
    // 키패드가 그려진 뒤 칸이 키패드 위에 보이게 올려요(시안 메모: 텍스트필드 선택 시 스크롤 위치 이동).
    requestAnimationFrame(() => field.scrollIntoView({ block: "center", behavior: "smooth" }));
  };

  const fieldRef = useRef<HTMLDivElement>(null);
  const keypadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isKeypadOpen) return;
    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (fieldRef.current?.contains(target) || keypadRef.current?.contains(target)) return;
      setIsKeypadOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [isKeypadOpen]);

  return (
    <>
      <div ref={fieldRef}>
        <TextField.Clearable
          variant="box"
          label="쓴 금액 *"
          labelOption="sustain"
          suffix="원"
          value={commaize(value)}
          // 기기 키보드를 띄우지 않아요. 브라우저에서 개발할 때는 키보드 입력도 받아요.
          inputMode="none"
          onFocus={event => open(event.currentTarget)}
          onChange={event => onChange(toAmount(event.target.value.replace(/\D/g, ""), value))}
          onClear={() => onChange(null)}
        />
      </div>
      {isKeypadOpen && (
        <>
          {/* 키패드(TDS 298px)만큼 아래 여백을 둬서 칸을 키패드 위로 올릴 수 있게 해요. */}
          <div aria-hidden className="h-[298px]" />
          {/* 시안처럼 [인증하기](z-50)까지 덮어요. */}
          <div
            ref={keypadRef}
            style={style}
            className="fixed inset-x-0 bottom-0 z-60 bg-(--adaptiveBackground) pb-(--safe-area-bottom)"
          >
            <NumberKeypad
              onKeyClick={key => onChange(toAmount(digits + key, value))}
              onBackspaceClick={() => onChange(toAmount(digits.slice(0, -1), value))}
            />
          </div>
        </>
      )}
    </>
  );
};

export default AmountField;
