import * as React from "react";

interface EmailTemplateProps {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fullName,
  email,
  subject,
  message,
}) => {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#f7f7f7",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <table
        border={0}
        cellPadding={0}
        cellSpacing={0}
        width="100%"
        style={{ backgroundColor: "#f7f7f7" }}
      >
        <tbody>
          <tr>
            <td align="center" style={{ padding: "20px 0 30px 0" }}>
              <table
                border={0}
                cellPadding={0}
                cellSpacing={0}
                width="600"
                style={{ borderCollapse: "collapse" }}
              >
                {/* HEADER */}
                <tbody>
                  <tr>
                    <td
                      align="center"
                      style={{
                        backgroundColor: "#2f2f2f",
                        padding: "30px",
                      }}
                    >
                      <p style={{ margin: 0, color: "#fff", fontSize: "32px", fontWeight: 600 }}>YAPPHY</p>
                    </td>
                  </tr>

                  {/* MAIN CONTENT */}
                  <tr>
                    <td
                      align="center"
                      style={{
                        backgroundColor: "#ffffff",
                        padding: "35px 30px",
                        border: "1px solid #e0e0e0",
                        borderTop: "none",
                        borderBottom: "none",
                      }}
                    >
                      <table
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        width="100%"
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                color: "#333333",
                                fontSize: "22px",
                                fontWeight: "bold",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              New Contact Request!
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: "20px 0 0 0",
                                color: "#333333",
                                fontSize: "16px",
                                lineHeight: "22px",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              Hi Yapphy,
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: "10px 0 0 0",
                                color: "#555555",
                                fontSize: "16px",
                                lineHeight: "1.5",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              <p style={{ margin: 0 }}>
                                <strong>From:</strong>{" "}
                                <a
                                  href="https://parcelotw.vercel.app"
                                  style={{ color: "#888888", textDecoration: "none" }}
                                >
                                  ParcelOTW
                                </a>
                              </p>
                              <p style={{ margin: 0 }}>
                                <strong>Name:</strong> {fullName}
                              </p>
                              <p style={{ margin: 0 }}>
                                <strong>Email:</strong> <a href={`mailto:${email}`} style={{ color: "#888888", textDecoration: "none" }}>{email}</a>
                              </p>
                              <p style={{ margin: 0 }}>
                                <strong>Subject:</strong> {subject}
                              </p>
                              <p style={{ margin: 0 }}>
                                <strong>Message:</strong>
                              </p>
                              <p style={{ margin: 0 }}>{message}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ paddingBottom: "30px" }}></td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: "10px 0 0 0",
                                color: "#555555",
                                fontSize: "16px",
                                lineHeight: "1.5",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              Kind Regards,
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                padding: "5px 0 0 0",
                                color: "#333333",
                                fontSize: "16px",
                                lineHeight: "1.5",
                                fontWeight: "bold",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              Yapphy
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  {/* FOOTER */}
                  <tr>
                    <td
                      align="center"
                      style={{
                        backgroundColor: "#2f2f2f",
                        padding: "35px 30px 30px",
                      }}
                    >
                      <table
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        width="100%"
                      >
                        <tbody>
                          <tr>
                            <td
                              style={{
                                color: "#ffffff",
                                fontSize: "14px",
                                lineHeight: "1.5",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              <div
                                style={{ fontSize: "16px", marginBottom: "5px" }}
                              >
                                <strong>Yapphy</strong>
                              </div>
                              Telephone: <a href="https://yapphy.vercel.app/#contact" style={{ color: "#ffffff", textDecoration: "none" }}>https://yapphy.vercel.app/#contact</a>
                              <br />
                              Email: <a href="https://yapphy.vercel.app/#contact" style={{ color: "#ffffff", textDecoration: "none" }}>https://yapphy.vercel.app/#contact</a>
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                paddingTop: "15px",
                                color: "#888888",
                                fontSize: "12px",
                                lineHeight: "18px",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              &copy; 2025 Yapphy. All rights reserved.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EmailTemplate;
