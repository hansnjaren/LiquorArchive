export default function UnitSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <select
      className="border rounded px-3 py-2"
      value={value}
      onChange={onChange}
    >
      <option value="beer">맥주 1캔(5.0%, 500ml)</option>
      <option value="soju">소주 1병(16.5%, 355ml)</option>
      <option value="alcohol">순수 알코올(ml)</option>
    </select>
  );
}
