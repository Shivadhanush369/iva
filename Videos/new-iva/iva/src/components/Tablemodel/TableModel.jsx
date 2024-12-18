
const TableModel = ({ alertData, riskLevel }) => {


    return (
        <div className="risk-container">
            <div className="card-left">
                {/* Left Card */}
                <div className="card-header">{issueTitle}</div>
                <div className="card-content">
                    {alertData.map((alert, index) => (
                        <div
                            key={index}
                            className="name"
                            onClick={() => displayDetails(alert)}
                        >
                            {alert.name}
                        </div>
                    ))}
                </div>
            </div>
            <div className="card-right">
                {/* Right Card */}
                {selectedAlertDetails ? (
                    <div className="details-section">
                        <h2>Issue Details</h2>
                        <p><strong>Url:</strong> {selectedAlertDetails.url}</p>
                        <p><strong>Alert Name:</strong> {selectedAlertDetails.name}</p>
                        <p><strong>Description:</strong> {selectedAlertDetails.description}</p>
                        <p><strong>Risk Description:</strong> {selectedAlertDetails.risk}</p>
                        <p><strong>Solution:</strong> {selectedAlertDetails.solution}</p>
                        <p>
                            <strong>CWE ID:</strong>{' '}
                            {selectedAlertDetails.cweid ? (
                                <>
                                    {selectedAlertDetails.cweid}
                                    &nbsp;&nbsp;
                                    <a
                                        href={`https://cwe.mitre.org/data/definitions/${selectedAlertDetails.cweid}.html`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="cwe-link"
                                    >
                                        click here
                                    </a>
                                </>
                            ) : (
                                'N/A'
                            )}
                        </p>
                        <p>
                            <strong>WASC ID:</strong>{' '}
                            {selectedAlertDetails.wascid ? (
                                <>
                                    {selectedAlertDetails.wascid}
                                    &nbsp;&nbsp;
                                    <a
                                        href="http://projects.webappsec.org/w/page/13246974/Threat%20Classification%20Reference%20Grid"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="wasc-link"
                                    >
                                        click here
                                    </a>
                                </>
                            ) : (
                                'N/A'
                            )}
                        </p>
                        <p>
                            <strong>Prediction:</strong> {selectedAlertDetails.prediction}{' '}
                            positive
                        </p>
                    </div>
                ) : (
                    <div className="no-details">Select an issue to view details.</div>
                )}
            </div>
        </div>
    );
};



export default TableModel;
