import StickerPanel from '../../components/StickerPanel.jsx';

export default function StickersSheet({ onClose }) {
  return (
    <div className="w-full h-full">
      <StickerPanel onClose={onClose} />
    </div>
  );
}
