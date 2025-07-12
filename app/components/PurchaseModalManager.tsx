import PurchaseAddModal from "./PurchaseAddModal";
import PurchaseDetailModal from "./PurchaseDetailModal";
import type { Purchase } from "../types";

interface Props {
  showAdd: boolean;
  showDetail: boolean;
  selected: Purchase | null;
  bottles: any[];
  onCloseAdd: () => void;
  onSubmitAdd: (p: Purchase) => void;
  onCloseDetail: () => void;
  onEdit: (p: Purchase) => void;
  onDelete: (id: string) => void;
}

export default function PurchaseModalManager({
  showAdd,
  showDetail,
  selected,
  bottles,
  onCloseAdd,
  onSubmitAdd,
  onCloseDetail,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      {showAdd && (
        <PurchaseAddModal
          bottles={bottles}
          onClose={onCloseAdd}
          onSubmit={onSubmitAdd}
        />
      )}
      {showDetail && selected && (
        <PurchaseDetailModal
          purchase={selected}
          bottle={bottles.find((b) => b.id === selected.bottleId)}
          onClose={onCloseDetail}
          bottles={bottles}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
