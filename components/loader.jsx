export default function Loading({type}) {
  if(type === 2) return <div className="lds-ripple"><div/><div/></div>;
  return (
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );
}
