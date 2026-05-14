import FramePanel from '../../components/FramePanel.jsx';

export default function FramesSheet({ onClose }) {
  return (
    <div className="w-full h-full">
      <FramePanel onClose={onClose} />
    </div>
  );
}
