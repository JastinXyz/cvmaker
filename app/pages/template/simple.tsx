import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import Html from "react-pdf-html";
import PDFViewerWrapper from "~/components/pdf-viewer-wrapper";
import { useFormStore } from "~/hooks/use-form-store";
import { renderMarkup } from "~/lib/render-markup";

export default function Simple() {
    const { formData } = useFormStore();
    const { t } = useTranslation();

    const styles = StyleSheet.create({
        page: { color: "#808080", fontSize: 9, padding: 24 },
        h1: { textTransform: "uppercase", fontWeight: 600, fontSize: 18, color: "#000000" },
        h2: { fontSize: 12, textTransform: "capitalize", fontWeight: 600, color: "#000000" },
        p: { fontSize: 9, lineHeight: '14px' }
    })

    return (
        <PDFViewerWrapper>
            <Document>
                <Page size={"A4"} style={styles.page}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: 'flex-start', gap: 10 }}>
                        {formData?.croppedImage && <Image src={formData?.croppedImage} style={{ width: 80, height: 80, flexShrink: 0 }} />}
                        <View style={{ flex: 1 }}>
                            <Html stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <>
                                        <div style={styles.h1}>{formData?.name}</div>
                                        <div style={{ fontSize: styles.p.fontSize }}>
                                            {formData?.phone && (<><a style={{ color: styles.page.color }} href={"tel:" + formData.phone}>{formData.phone}</a> | </>)}
                                            {formData?.email && (<><a style={{ color: styles.page.color }} href={"mailto:" + formData.email}>{formData.email}</a> | </>)}
                                            {formData?.linkedin && (<><a style={{ color: styles.page.color }} href={formData.linkedin}>{formData.linkedin}</a> | </>)}
                                            {formData?.website && (<><a style={{ color: styles.page.color }} href={formData.website}>{formData.website}</a></>)}
                                        </div>
                                        <div style={{ ...styles.p, textAlign: 'justify', color: styles.h1.color, marginTop: 4 }}>
                                            {formData?.short_description}
                                        </div>
                                    </>
                                )}
                            </Html>
                        </View>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Html style={[styles.p]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                            {renderMarkup(
                                <>
                                    <p style={{ ...styles.h2, marginLeft: 6 }}>{formData?.titles.work_experience}</p>
                                    <div style={{ borderBottom: '1.5px solid #000', marginTop: 3 }}></div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        {formData?.work_experience.map((x) => (
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontWeight: 600 }}><span style={{ color: styles.h1.color }}>{x.company}</span> {x.location && `- ${x.location}`}</div>
                                                    <div style={{ textTransform: 'capitalize', color: styles.h1.color }}>{x.startMonth} {x.startYear} {((x.startMonth || x.startYear) && (x.present || x.endMonth || x.endYear)) && "-"} {x.present ? t('general.present') : `${x.endMonth} ${x.endYear}`}</div>
                                                </div>
                                                <div style={{ fontStyle: 'italic', color: styles.h1.color }}>{x.position}</div>
                                                {x.description.replace("<p><br></p>", "").length ? <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: x.description }}></div> : null}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </Html>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Html style={[styles.p]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                            {renderMarkup(
                                <>
                                    <p style={{ ...styles.h2, marginLeft: 6 }}>{formData?.titles.education}</p>
                                    <div style={{ borderBottom: '1.5px solid #000', marginTop: 3 }}></div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        {formData?.education.map((x) => (
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontWeight: 600 }}><span style={{ color: styles.h1.color }}>{x.name}</span> {x.location && `- ${x.location}`}</div>
                                                    <div style={{ textTransform: 'capitalize', color: styles.h1.color }}>{x.startMonth} {x.startYear} {((x.startMonth || x.startYear) && (x.endMonth || x.endYear)) && "-"} {x.endMonth} {x.endYear}</div>
                                                </div>
                                                <div style={{ fontStyle: 'italic', color: styles.h1.color }}>{x.degree}</div>
                                                {x.description.replace("<p><br></p>", "").length ? <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: x.description }}></div> : null}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </Html>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Html style={[styles.p]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                            {renderMarkup(
                                <>
                                    <p style={{ ...styles.h2, marginLeft: 6 }}>{formData?.titles.skills}</p>
                                    <div style={{ borderBottom: '1.5px solid #000', marginTop: 3 }}></div>
                                    <div style={{ display: 'flex', marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', width: '100%'  }}>
                                        {formData?.skills.map((x, idx) => (
                                            <div style={{ flex: '0 1 calc(33.333%)', marginTop: idx > 2 ? 6 : 0 }}>
                                                <div style={{ fontWeight: 600, color: styles.h1.color }}>{x.name}</div>
                                                <div style={{ fontStyle: 'italic', color: styles.h1.color }}>{x.level}</div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </Html>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Html style={[styles.p]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                            {renderMarkup(
                                <>
                                    <p style={{ ...styles.h2, marginLeft: 6 }}>{formData?.titles.language}</p>
                                    <div style={{ borderBottom: '1.5px solid #000', marginTop: 3 }}></div>
                                    <div style={{ display: 'flex', marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', width: '100%'  }}>
                                        {formData?.languages.map((x, idx) => (
                                            <div style={{ flex: '0 1 calc(33.333%)', marginTop: idx > 2 ? 6 : 0 }}>
                                                <div style={{ fontWeight: 600, color: styles.h1.color }}>{x.name}</div>
                                                <div style={{ fontStyle: 'italic', color: styles.h1.color }}>{x.level}</div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </Html>
                    </View>
                    <View style={{ marginTop: 8 }}>
                        <Html style={[styles.p]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                            {renderMarkup(
                                <>
                                    <p style={{ ...styles.h2, marginLeft: 6 }}>{formData?.titles.other}</p>
                                    <div style={{ borderBottom: '1.5px solid #000', marginTop: 3 }}></div>
                                    <div style={{ display: 'flex', marginTop: 8, gap: 2  }}>
                                        {formData?.other_experiences.map((x) => (
                                            <div style={{ color: styles.h1.color }}>
                                                {x.category && <span style={{ fontWeight: 600 }}>{x.category} {x.year && <>&nbsp;</>}</span>}
                                                {x.year && <span>({x.year})</span>}
                                                <span>{(x.year || x.category) && <>: </>} {x.elaboration}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </Html>
                    </View>
                    {formData?.custom_experiences.map((x) => (
                        <>
                            <View style={{ marginTop: 8 }}>
                                <Html style={[styles.p]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                    {renderMarkup(
                                        <>
                                            <p style={{ ...styles.h2, marginLeft: 6 }}>{x.title}</p>
                                            <div style={{ borderBottom: '1.5px solid #000', marginTop: 3 }}></div>
                                            <div style={{ marginTop: 8, color: styles.h1.color }} dangerouslySetInnerHTML={{ __html: `
                                                <style>
                                                    li[data-list="bullet"] {
                                                        list-style-type: disc;
                                                    }

                                                    li[data-list="ordered"] {
                                                        list-style-type: decimal;
                                                    }
                                                </style>
                                                ${x.description}
                                            ` }}></div>
                                        </>
                                    )}
                                </Html>
                            </View>
                        </>
                    ))}
                </Page>
            </Document>
        </PDFViewerWrapper>
    )
}