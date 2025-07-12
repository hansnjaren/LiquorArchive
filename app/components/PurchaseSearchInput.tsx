export default function PurchaseSearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="이름, 카테고리, 국가, 장소, 메모, 가격에서 검색"
        className="border rounded-lg px-3 py-2 w-full"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
