import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormStore } from "~/hooks/use-form-store";
import { SourceSansPro } from "~/lib/fonts";
import { format } from "date-fns";
import type { PDFDetail, TemplateParam } from "~/types";
import { MaterialIcon } from "~/components/pdf/material-icon";
import Email from '@mui/icons-material/Email';
import Home from '@mui/icons-material/Home';
import Html from "react-pdf-html";
import { renderMarkup } from "~/lib/render-markup";
import PdfExport from "~/components/pdf-export";

export default function OtagoRender() {
    return <PdfExport document={<Otago />} />
}

export function Otago({ activeFormId }: TemplateParam) {
    const { formData, setActiveForm } = useFormStore();
    const { t } = useTranslation();
    const [detail, setDetail] = useState<PDFDetail[]>();

    Font.register({ family: 'Source Sans Pro', fonts: SourceSansPro as any });

    const styles = StyleSheet.create({
        page: { fontFamily: "Source Sans Pro", color: "#4c4c4c", fontSize: 11, padding: 24 },
        h1: { textTransform: "uppercase", fontWeight: 700, fontSize: 20, letterSpacing: 2, color: '#333333' },
        h2: { fontSize: 16, textTransform: "uppercase", fontWeight: 700, letterSpacing: 2, color: '#333333' },
        p: { fontSize: 11, lineHeight: '18px' }
    })

    useEffect(() => {
        if(activeFormId) setActiveForm(activeFormId)
    }, [activeFormId])

    useEffect(() => {
        setDetail([
            { title: t('personalInformation.phone_number'), value: formData?.phone },
            { title: t('personalInformation.website'), value: formData?.website },
            { title: t('personalInformation.birth_date'), value: formData?.birth_date ? format(formData?.birth_date, "dd-MM-yyyy") : '' },
            { title: t('personalInformation.birth_place'), value: formData?.birth_place, case: 'capitalize' },
            { title: 'LinkedIn', value: formData?.linkedin },
        ])
    }, [formData])

    return (
            <Document>
                <Page size={"A4"} style={styles.page}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: 'flex-start', gap: 10 }}>
                        {formData?.croppedImage && <Image src={formData?.croppedImage} style={{ width: 35, height: 35, borderRadius: 50 }} />}
                        <View>
                            <Text style={[styles.h1]}>{formData?.name}</Text>
                            <View style={{ fontSize: styles.p.fontSize, marginTop: -4, display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                                {formData?.email && (<View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}><MaterialIcon color={styles.page.color} icon={Email} size={11} /> <Text>{formData.email}</Text></View>)}
                                {formData?.address && (<View style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center' }}><MaterialIcon color={styles.page.color} icon={Home} size={11} /> <Text>{formData.address}</Text> </View>)}
                            </View>
                        </View>
                    </View>
                    <Html stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }} style={[styles.p, { marginTop: 16 }]}>
                        {renderMarkup(
                            <>
                                <div style={{ paddingTop: 8, borderTop: "1px solid #b7b7b7", display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                                    {detail?.map((x) => (
                                        <>
                                            {x.value && (
                                                <div style={{ marginTop: 5, flex: '0 1 calc(33.333%)' }}>
                                                    <div style={{ fontWeight: 600, color: styles.h1.color }}>{x.title}</div>
                                                    <div style={{ textTransform: x.case ? x.case : 'none', marginTop: -4 }}>{x.value}</div>
                                                </div>
                                            )}
                                        </>
                                    ))}
                                </div>
                                {formData?.short_description && (
                                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #b7b7b7" }}>
                                        <p>{formData?.short_description}</p>
                                    </div>
                                )}
                                {formData?.work_experience.length ? (
                                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #b7b7b7" }}>
                                        <p style={styles.h2}>{formData?.titles.work_experience}</p>
                                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                            {formData?.work_experience.map((x) => (
                                                <div style={{ display: 'flex' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ fontWeight: 600, color: styles.h1.color }}>{x.position}</div>
                                                        <div style={{ textTransform: 'capitalize' }}>{x.startMonth} {x.startYear} {((x.startMonth || x.startYear) && (x.present || x.endMonth || x.endYear)) && "-"} {x.present ? t('general.present') : `${x.endMonth} ${x.endYear}`}</div>
                                                    </div>
                                                    <div style={{ marginTop: -4 }}>{x.company}{x.location && `, ${x.location}`}</div>
                                                    {x.description.replace("<p><br></p>", "").length ? <div style={{ marginRight: 96 }} dangerouslySetInnerHTML={{ __html: x.description }}></div> : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                                {formData?.education.length ? (
                                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #b7b7b7" }}>
                                        <p style={styles.h2}>{formData?.titles.education}</p>
                                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                            {formData?.education.map((x) => (
                                                <div style={{ display: 'flex' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ fontWeight: 600, color: styles.h1.color }}>{x.degree}</div>
                                                        <div style={{ textTransform: 'capitalize' }}>{x.startMonth} {x.startYear} {((x.startMonth || x.startYear) && (x.endMonth || x.endYear)) && "-"} {x.endMonth} {x.endYear}</div>
                                                    </div>
                                                    <div style={{ marginTop: -4 }}>{x.name}{x.location && `, ${x.location}`}</div>
                                                    {x.description.replace("<p><br></p>", "").length ? <div style={{ marginRight: 96 }} dangerouslySetInnerHTML={{ __html: x.description }}></div> : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                                {(formData?.skills.length || formData?.languages.length) ? (
                                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #b7b7b7", display: 'flex', flexDirection: 'row' }}>
                                        {formData.skills.length ? (
                                            <div style={{ width: '50%' }}>
                                                <p style={{...styles.h2, marginBottom: 2 }}>{formData?.titles.skills}</p>
                                                <div style={{ display: 'flex', marginTop: 10 }}>
                                                    {formData?.skills.map((x) => (
                                                        <div style={{ display: 'flex', marginTop: -2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ fontWeight: 600, color: styles.h1.color }}>{x.name}</div>
                                                            <div>{x.level}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                        {formData.languages.length ? (
                                            <>
                                                <div style={{ borderRight: '1px solid #b7b7b7', margin: "0 10 0 10" }}></div>
                                                <div style={{ width: '50%' }}>
                                                    <p style={{...styles.h2, marginBottom: 2 }}>{formData?.titles.language}</p>
                                                    <div style={{ display: 'flex', marginTop: 10 }}>
                                                        {formData?.languages.map((x) => (
                                                            <div style={{ display: 'flex', marginTop: -2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div style={{ fontWeight: 600, color: styles.h1.color }}>{x.name}</div>
                                                                <div>{x.level}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                ) : null}
                                {formData?.other_experiences.length ? (
                                    <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #b7b7b7" }}>
                                        <p style={styles.h2}>{formData?.titles.other}</p>
                                        <div style={{ display: 'flex', marginBottom: 2, marginTop: 10 }}>
                                            {formData?.other_experiences.map((x) => (
                                                <div style={{ marginTop: -2 }}>
                                                    {x.category && <span style={{ fontWeight: 600, color: styles.h1.color }}>{x.category} {x.year && <>&nbsp;</>}</span>}
                                                    {x.year && <span>({x.year})</span>}
                                                    <span>{(x.year || x.category) && <>: </>} {x.elaboration}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}
                                {formData?.custom_experiences.map((x) => (
                                    <>
                                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #b7b7b7" }}>
                                            <p style={styles.h2}>{x.title}</p>
                                            <div style={{ marginTop: 10 }} dangerouslySetInnerHTML={{ __html: `
                                                <style>
                                                    li[data-list="bullet"] {
                                                        list-style-type: disc;
                                                    }
                                                
                                                    li[data-list="ordered"] {
                                                        list-style-type: decimal;
                                                    }
                                                </style>
                                                ${x.description}
                                                `}}></div>
                                        </div>
                                    </>
                                ))}
                            </>
                        )}
                    </Html>
                </Page>
            </Document>
    )
}