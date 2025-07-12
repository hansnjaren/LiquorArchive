export function BottleSearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="이름, 카테고리, 국가, 도수, 용량 등으로 검색"
        className="w-full border rounded px-3 py-2 text-lg"
      />
    </div>
  );
}
