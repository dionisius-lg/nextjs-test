export default function Footer() {
    return (
        <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid">
                <div className="d-flex align-items-center justify-content-between small">
                    <div className="text-muted">{process.env.project.name} &copy; {process.env.company.name} {process.env.project.year}</div>
                    <div>
                        <a href="#">Privacy Policy</a>
                        &middot;
                        <a href="#">Terms &amp; Conditions</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
