import Loading from "@component/loader";
export default function pdfLoading() {
    return <div className="center" style={{marginTop: "10%"}}>
           <Loading type={2} />
    </div>
}