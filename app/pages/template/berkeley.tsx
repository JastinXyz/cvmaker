import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { useFormStore } from '~/hooks/use-form-store';
import Html from 'react-pdf-html';
import { renderMarkup } from '~/lib/render-markup';
import { useTranslation } from 'react-i18next';
import { format } from "date-fns";
import { useEffect, useState } from 'react';
import { MaterialIcon } from '~/components/pdf/material-icon';
import Group from '@mui/icons-material/Group';
import BusinessCenter from '@mui/icons-material/BusinessCenter';
import Menu from '@mui/icons-material/Menu';
import School from '@mui/icons-material/School';
import Translate from '@mui/icons-material/Translate';
import EmojiEvents from '@mui/icons-material/EmojiEvents';
import { SourceSansPro } from '~/lib/fonts';
import type { PDFDetail } from '~/types';
import PdfExport from '~/components/pdf-export';

export default function SimpleBerkeley() {
    return <PdfExport document={<Berkeley />} />
}

function Berkeley() {
    const { formData } = useFormStore();
    const { t } = useTranslation();
    const [detail, setDetail] = useState<PDFDetail[]>();

    Font.register({ family: 'Source Sans Pro', fonts: SourceSansPro as any });

    const styles = StyleSheet.create({
        page: { fontFamily: "Source Sans Pro", color: "#4c4c4c", fontSize: 11, padding: 28 },
        h1: { textTransform: "uppercase", fontWeight: 600, fontSize: 30  },
        h2: { fontSize: 13 },
        p: { fontSize: 11, lineHeight: '18px' }
    })

    useEffect(() => {
        setDetail([
            { title: t('general.name'), value: formData?.name, case: 'uppercase' },
            { title: t('personalInformation.address'), value: formData?.address, case: 'capitalize' },
            { title: t('personalInformation.birth_date'), value: formData?.birth_date ? format(formData?.birth_date, "dd-MM-yyyy") : '' },
            { title: t('personalInformation.birth_place'), value: formData?.birth_place, case: 'capitalize' },
        ])
    }, [formData])
    
    return (
            <Document>
                <Page size={"A4"} style={styles.page}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: 'flex-start', gap: 10 }}>
                        {formData?.croppedImage && <Image src={formData?.croppedImage} style={{ width: 45, height: 45, borderRadius: 50 }} />}
                        <Html stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                            {renderMarkup(
                                <>
                                    <div style={styles.h1}>{formData?.name}</div>
                                    <div style={{ fontSize: styles.p.fontSize, marginTop: -6 }}>
                                        {formData?.phone && (<><a style={{ color: styles.page.color }} href={"tel:" + formData.phone}>{formData.phone}</a> | </>)}
                                        {formData?.email && (<><a style={{ color: styles.page.color }} href={"mailto:" + formData.email}>{formData.email}</a> | </>)}
                                        {formData?.linkedin && (<><a style={{ color: styles.page.color }} href={formData.linkedin}>LinkedIn</a> | </>)}
                                        {formData?.website && (<><a style={{ color: styles.page.color }} href={formData.website}>{formData.website}</a></>)}
                                    </div>
                                </>
                            )}
                        </Html>
                    </View>
                    <View style={{ backgroundColor: "#f1f1f1", marginTop: 16, padding: 7, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                        <MaterialIcon icon={Group} size={13} />
                        <Text style={[styles.h2]}>{formData?.titles.personal_information}</Text>
                    </View>
                    <Html style={[styles.p, { marginTop: 6 }]}>
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
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 6, padding: 7, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={Menu} size={13} />
                                <Text style={[styles.h2]}>{formData?.titles.profile}</Text>
                            </View>
                            <Text style={[styles.p, { marginTop: 6 }]}>
                                {formData?.short_description}
                            </Text>
                        </>
                    )}
                    {formData?.work_experience.length && (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 6, padding: 7, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={BusinessCenter} size={13} />
                                <Text style={[styles.h2]}>{formData?.titles.work_experience}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 6 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <div style={{ display: 'flex', gap: 8 }}>
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
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 6, padding: 7, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={School} size={13} />
                                <Text style={[styles.h2]}>{formData?.titles.education}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 6 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <div style={{ display: 'flex', gap: 8 }}>
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
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 6, padding: 7, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={School} size={13} />
                                <Text style={[styles.h2]}>{formData?.titles.skills}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 6 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                                        {formData?.skills.map((x, idx) => (
                                            <div style={{ flex: '0 1 calc(33.333%)', marginTop: idx > 2 ? 6 : 0 }}>
                                                <div style={{ fontWeight: 600 }}>{x.name}</div>
                                                <div style={{ fontStyle: 'italic', marginTop: -4 }}>{x.level}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Html>
                        </>
                    )}
                    {formData?.languages.length && (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 6, padding: 7, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={Translate} size={13} />
                                <Text style={[styles.h2]}>{formData?.titles.language}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 6 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
                                {renderMarkup(
                                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%' }}>
                                        {formData?.languages.map((x, idx) => (
                                            <div style={{ flex: '0 1 calc(33.333%)', marginTop: idx > 2 ? 6 : 0 }}>
                                                <div style={{ fontWeight: 600 }}>{x.name}</div>
                                                <div style={{ fontStyle: 'italic', marginTop: -4 }}>{x.level}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Html>
                        </>
                    )}
                    {formData?.other_experiences.length && (
                        <>
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 6, padding: 7, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <MaterialIcon icon={EmojiEvents} size={13} />
                                <Text style={[styles.h2]}>{formData?.titles.other}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 6 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
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
                            <View style={{ backgroundColor: "#f1f1f1", marginTop: 6, padding: 7, display: "flex", flexDirection: "row", gap: 10, alignItems: 'center' }}>
                                <Text style={[styles.h2]}>{x.title}</Text>
                            </View>
                            <Html style={[styles.p, { marginTop: 6 }]} stylesheet={{ p: { margin: 0 }, ol: { margin: 0 } }}>
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
    )
}