import ImageAdjustPanel from '../../components/ImageAdjustPanel.jsx';

/** Thin wrapper so the same panel works on desktop sidebar and mobile sheet. */
export default function AdjustSheet({ onClose }) {
  return <ImageAdjustPanel onClose={onClose} />;
}
