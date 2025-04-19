import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import PDFViewerWrapper from '~/components/pdf-viewer-wrapper';
import { useFormStore } from '~/hooks/use-form-store';
import Html from 'react-pdf-html';
import { renderMarkup } from '~/lib/render-markup';
import { useTranslation } from 'react-i18next';
import { format } from "date-fns";
import { useEffect, useState } from 'react';
import { MaterialIcon } from '~/components/pdf/material-icon';
import { BusinessCenter, Group, Interests, Menu, School, Translate } from '@mui/icons-material';

export default function Berkeley() {
    const { formData } = useFormStore();
    const { t } = useTranslation();
    const [detail, setDetail] = useState<{ title: string, value?: string, case?: 'lowercase' | 'uppercase' | 'capitalize' | 'none'; }[]>();

    Font.register({ family: 'Source Sans Pro', fonts: [
            { fontStyle: "normal", fontWeight: 200, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/toadOcfmlt9b38dHJxOBGKXvKVW_haheDNrHjziJZVk.ttf" },
            { fontStyle: "normal", fontWeight: 300, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/toadOcfmlt9b38dHJxOBGFP7R5lD_au4SZC6Ks_vyWs.ttf" },
            { fontStyle: "normal", fontWeight: 400, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/ODelI1aHBYDBqgeIAH2zlNRl0pGnog23EMYRrBmUzJQ.ttf" },
            { fontStyle: "normal", fontWeight: 600, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/toadOcfmlt9b38dHJxOBGOiMeWyi5E_-XkTgB5psiDg.ttf" },
            { fontStyle: "normal", fontWeight: 700, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/toadOcfmlt9b38dHJxOBGPgXsetDviZcdR5OzC1KPcw.ttf" },
            { fontStyle: "normal", fontWeight: 900, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/toadOcfmlt9b38dHJxOBGBA_awHl7mXRjE_LQVochcU.ttf" },
            { fontStyle: "italic", fontWeight: 200, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/fpTVHK8qsXbIeTHTrnQH6OptKU7UIBg2hLM7eMTU8bI.ttf" },
            { fontStyle: "italic", fontWeight: 300, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/fpTVHK8qsXbIeTHTrnQH6DUpNKoQAsDux-Todp8f29w.ttf" },
            { fontStyle: "italic", fontWeight: 400, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/M2Jd71oPJhLKp0zdtTvoMwRX4TIfMQQEXLu74GftruE.ttf" },
            { fontStyle: "italic", fontWeight: 600, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/fpTVHK8qsXbIeTHTrnQH6Pp6lGoTTgjlW0sC4r900Co.ttf" },
            { fontStyle: "italic", fontWeight: 700, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/fpTVHK8qsXbIeTHTrnQH6LVT4locI09aamSzFGQlDMY.ttf" },
            { fontStyle: "italic", fontWeight: 900, src: "http://fonts.gstatic.com/s/sourcesanspro/v9/fpTVHK8qsXbIeTHTrnQH6A0NcF6HPGWR298uWIdxWv0.ttf" },
        ] 
    });

    const styles = StyleSheet.create({
        page: { fontFamily: "Source Sans Pro", color: "#4c4c4c", fontSize: 13, padding: 28 },
        h1: { textTransform: "uppercase", fontWeight: 600, fontSize: 30  },
        h2: { fontSize: 16 },
        p: { fontSize: 13, lineHeight: '18px' }
    })

    useEffect(() => {
        setDetail([
            { title: t('general.name'), value: formData?.name, case: 'uppercase' },
            { title: t('personalInformation.address'), value: formData?.address, case: 'capitalize' },
            { title: t('personalInformation.birth_date'), value: formData?.birth_date ? format(formData?.birth_date, "dd-MM-yyyy") : '' },
            { title: t('personalInformation.birth_place'), value: formData?.birth_place, case: 'capitalize' },
            { title: 'Linkedin', value: formData?.linkedin },
            { title: t('personalInformation.website'), value: formData?.website },
        ])
    }, [formData])
    
    return (
        <PDFViewerWrapper>
            <Document>
                <Page size={"A4"} style={styles.page}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: 'flex-start', gap: 10 }}>
                        <Image src={formData?.croppedImage!} style={{ width: 45, height: 45, borderRadius: 50 }} />
                        <Html stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                            {renderMarkup(
                                <>
                                    <div style={styles.h1}>{formData?.name}</div>
                                    <div style={{ fontSize: 13, marginTop: -6 }}>
                                        {formData?.phone && (<><a href={"tel:" + formData.phone}>{formData.phone}</a> | </>)}
                                        {formData?.email && (<><a href={"mailto:" + formData.email}>{formData.email}</a></>)}
                                    </div>
                                </>
                            )}
                        </Html>
                    </View>
                    <View style={{ backgroundColor: "#f1f1f1", marginTop: 20, padding: 10, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                        <MaterialIcon icon={Group} size={16} />
                        <Text style={[styles.h2]}>{formData?.titles.personal_information}</Text>
                    </View>
                    <Html style={[styles.p, { marginTop: 10 }]}>
                        {renderMarkup(
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '100%' }}>
                                            <table>
                                                <tbody>
                                                    {detail?.map((x) => (
                                                        <>
                                                            {x.value && (
                                                                <tr style={{ marginTop: 5 }}>
                                                                    <td style={{ textAlign: 'left', width: '100px' }}>{x.title}</td>
                                                                    <td style={{ textTransform: x.case ? x.case : 'none', fontWeight: 600 }}>{x.value}</td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </Html>
                    {formData?.short_description && (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 14, padding: 10, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={Menu} size={16} />
                                <Text style={[styles.h2]}>{formData?.titles.profile}</Text>
                            </View>
                            <Text style={[styles.p, { marginTop: 10 }]}>
                                {formData?.short_description}
                            </Text>
                        </>
                    )}
                    {formData?.work_experience.length && (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 14, padding: 10, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={BusinessCenter} size={16} />
                                <Text style={[styles.h2]}>{formData?.titles.work_experience}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 10 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        {formData?.work_experience.map((x) => (
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontWeight: 600 }}>{x.position}</div>
                                                    <div style={{ textTransform: 'capitalize' }}>{x.startMonth} {x.startYear} {((x.startMonth || x.startYear) && (x.present || x.endMonth || x.endYear)) && "-"} {x.present ? t('general.present') : `${x.endMonth} ${x.endYear}`}</div>
                                                </div>
                                                <div style={{ fontStyle: 'italic' }}>{x.company}{x.location && `, ${x.location}`}</div>
                                                {x.description.replace("<p><br></p>", "").length ? <div dangerouslySetInnerHTML={{ __html: x.description }}></div> : null}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Html>
                        </>
                    )}
                    {formData?.education.length && (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 14, padding: 10, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={School} size={16} />
                                <Text style={[styles.h2]}>{formData?.titles.education}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 10 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        {formData?.education.map((x) => (
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontWeight: 600, textTransform: 'uppercase' }}>{x.degree}</div>
                                                    <div style={{ textTransform: 'capitalize' }}>{x.startMonth} {x.startYear} {((x.startMonth || x.startYear) && (x.endMonth || x.endYear)) && "-"} {x.endMonth} {x.endYear}</div>
                                                </div>
                                                <div style={{ fontStyle: 'italic' }}>{x.name}{x.location && `, ${x.location}`}</div>
                                                {x.description.replace("<p><br></p>", "").length ? <div dangerouslySetInnerHTML={{ __html: x.description }}></div> : null}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Html>
                        </>
                    )}
                    {formData?.skills.length && (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 14, padding: 10, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={School} size={16} />
                                <Text style={[styles.h2]}>{formData?.titles.skills}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 10 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        {formData?.skills.map((x) => (
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ fontWeight: 600 }}>{x.name}</div>
                                                <div style={{ fontStyle: 'italic' }}>{x.level}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Html>
                        </>
                    )}
                    {formData?.languages.length && (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 14, padding: 10, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={Translate} size={16} />
                                <Text style={[styles.h2]}>{formData?.titles.language}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 10 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        {formData?.languages.map((x) => (
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ fontWeight: 600 }}>{x.name}</div>
                                                <div style={{ fontStyle: 'italic' }}>{x.level}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Html>
                        </>
                    )}
                    {formData?.interest.length && (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 14, padding: 10, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={Interests} size={16} />
                                <Text style={[styles.h2]}>{formData?.titles.interest}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 10 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        {formData?.interest.map((x) => (
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ fontWeight: 600 }}>{x.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Html>
                        </>
                    )}
                    {formData?.other_experiences.length && (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 14, padding: 10, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={Interests} size={16} />
                                <Text style={[styles.h2]}>{formData?.titles.interest}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 10 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {formData?.other_experiences.map((x) => (
                                            <div>
                                                {x.category && <span style={{ fontWeight: 600 }}>{x.category} {x.year && <>&nbsp;</>}</span>}
                                                {x.year && <span>({x.year})</span>}
                                                <span>{(x.year || x.category) && <>: </>} {x.elaboration}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Html>
                        </>
                    )}
                    {formData?.custom_experiences.map((x) => (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 14, padding: 10, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <Text style={[styles.h2]}>{x.title}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 10 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {`
                                <style>
                                    li[data-list="bullet"] {
                                        list-style-type: disc;
                                    }

                                    li[data-list="ordered"] {
                                        list-style-type: decimal;
                                    }
                                </style>
                                ${x.description}
                                `}
                            </Html>
                        </>
                    ))}

                </Page>
            </Document>
        </PDFViewerWrapper>
    )
}