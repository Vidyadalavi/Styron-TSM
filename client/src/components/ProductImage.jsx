export default function ProductImage({ type, alt = '' }) {
  if (!type) {
    return <div className="product-img-placeholder">No Image</div>;
  }
  return (
    <img
      src={type}
      alt={alt}
      className="product-img"
      loading="lazy"
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
  );
}
