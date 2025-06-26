import React, { useState, useEffect, useRef } from "react";
import DakshabhiLogo from 'assets/images/DakshabhiLogo.png';
import EmployeeLogo from 'assets/images/EmployeeLogo.png';
import { Form } from "react-bootstrap";

const MEmployeeWorkerPrint = ({ employeeId, currentLanguage }) => {

    const [employeeDataForPrint, setEmployeeDataForPrint] = useState([]);
    const [educationData, setEducationData] = useState([]);
    const [workExperienceData, setWorkExperienceDetails] = useState([]);
    const [uploadImage, setImage] = useState();
    // const [currentLanguage, setCurrentLanguage] = useState(currentLanguage);

    useEffect(() => {
        debugger
        // React to language change if necessary
        // handleLanguageChange();
        console.log('Language changed to:', currentLanguage);
    }, [currentLanguage]);
    // const handleLanguageChange = (event) => {
    //     setCurrentLanguage(event.target.value);
    // };
    // const handleLanguageChange = () => {
    //     setCurrentLanguage(currentLanguage);
    // };
    useEffect(() => {
        const loadDataOnload = async () => {
            try {
                await FnCheckUpdateResponce();
            } catch (error) {
                console.error(error);
            }
        }
        loadDataOnload()

    }, [])

    const FnCheckUpdateResponce = async () => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/employees/FnShowSalaryAndWorkProfileRecords/${employeeId}`)
            const apiResponse = await apiCall.json();
            let employeeAllDetails = apiResponse.EmployeeMasterRecords;
            let employeeEducationalDetails = apiResponse.EmployeesQualificationDetails ?? [];
            let employeeWorkExpDetails = apiResponse.EmployeeExperiencedetails ?? [];
            setEmployeeDataForPrint(employeeAllDetails);
            setEducationData(employeeEducationalDetails);
            setWorkExperienceDetails(employeeWorkExpDetails);

            if (employeeAllDetails.encodedImage !== null) {
                setImage(`data:image/jpeg;base64,${employeeAllDetails.encodedImage}`)
            }
        } catch (error) {
            console.log("error", error)
        }
    }


    const labels = {
        english: {
            dateOfBirth: 'Date of Birth:',
            maritalStatus: 'Marital Status:',
            // numberOfChildren: 'Number of Children:',
            bloodGroup: 'Blood Group:',
            mobileNo: 'Mobile No:',
            // emergencyMobileNo: 'Emergency Mobile No:',
            aadharNo: 'Aadhar No:',
            panCardNo: 'Pan Card No:',
        },
        hindi: {
            language: 'भाषा',
            forOfficeHeader: '(केवल कार्यालय के लिए)',
            dateOfBirth: 'जन्म तिथि',
            maritalStatus: 'वैवाहिक स्थिति',
            // numberOfChildren: 'यदि परिणीत है तो बच्चों की संख्या',
            bloodGroup: 'रक्त समूह',
            mobileNo: 'मोबाइल नंबर',
            // emergencyMobileNo: 'आपातकालीन मोबाइल नं.',
            aadharNo: 'आधार नंबर',
            panCardNo: 'पैन कार्ड नंबर',
            referencePersonName: 'पहचान करनेवाले का नाम',
            referencePersonMobile: 'उनका मोबाइल नंबर',
            companyName: 'कंपनी का नाम',
            post: 'पद',
            workPeriod: 'कार्य की अवधि',
            lastSalary: 'अंतिम वेतन',
            course: 'अभ्यास',
            passYear: 'उत्तीर्ण वर्ष',
            board: 'बोर्ड',
            percentage: 'प्रतिशत',
            formHeader: 'कामगारों को भर्ती करने का आवेदन पत्र',
            fullName: 'नाम (पूरा)',
            permanentAddress: 'स्थायी पता',
            educationalDetails: 'शैक्षणिक योग्यता',
            workExperience: 'कार्य का अनुभव',
            referenceDetails: 'पहचान का विवरण',
            employeeRules: "कामगारों के लिए नौकरी के नियम",
            employeeRulesDetails1: "कामगारों की उपस्थिति पंचिंग मशीन द्वारा ही ली जाएगी.",
            // यदि पंचिंग करना भूल गए तो उस दिन की अनुपस्थिति गिनी जाएगी तथा बाद में किसी भी प्रकार की कोई सुनवाई नहीं होगी
            // employeeRulesDetails2: "समयानुसार कार्य पर आयें, देरी से आने पर अथवा जल्दी जाने पर अथवा कार्य-स्थल से अनुपस्थितरहने पर वेतन में से कटौती की जाएगी. विभागाधिकारी की सुचनानुसार ही पारी बदली जा सकती है. पारी समय से 10 मिनिट पूर्व आयें",
            employeeRulesDetails3: "जब अवकाश पर जानाहो तो समयपालक कार्यालय से अवकाश अनुमति पत्र लेकर विभागाधिकारी की हस्ताक्षर करवाकर समयपालक कार्यालय में जमा करवाएं.",
            employeeRulesDetails4: "अवकाश पर जाने से निम्नतम एक दिन पूर्व सूचित करना अनिवार्य है. ",
            // यदि अवकाश 8 दिवस से अधिक है तो विभाग के अधिकारी से अनुमति लेना आवश्यक है. यदि बिना पूर्व सुचना के 8 दिवस से अधिक अनुपस्थित रहने पर निष्काशित किया जा सकता है.",
            employeeRulesAcknowledgement: "मध्यान्ह भोजन अवकाश का समय (40 मिनिट) पूर्ण होने पर कार्य-स्थल पर आ जावें.",
            employeeRulesAcknowledgement2: "हर माह जितने दिन कार्य किया है उतने ही दिन का वेतन मिलेगा.",
            employeeRulesAcknowledgement3: "हर महीने वेतन समयानुसार तथा बैंक खाते में जमा होगी.",
            employeeRulesAcknowledgement4: "वेतन वृधि कार्य कुशलता तथा कम्पनी के नियमानुसार ही होगी.",
            employeeRulesAcknowledgement5: "नौकरी छोड़ने से एक महिनापूर्व त्यागपत्र देकर अनुमोदित करवना होगा. ",
            // अन्यथा एक महीने की वेतन कटौती होगी.",
            // employeeRulesAcknowledgement6: "यदि दो वर्ष पूर्व नौकरी छोड़ते हैं तो वेतन से की गयी कटौती वापस नहीं की जाएगी.",
            employeeRulesAcknowledgement6: "६ दिन के पश्चात १ दिन विश्राम का दिया जायेगा। वह विभाग द्वारा निर्धारित होगा.",
            employeeRulesAcknowledgement7: "कर्मचारी को राज्य आदेश में निर्दिष्ट छुटट्‌यो के अनुसार छुट्‌टी मिलेगी ।.",
            employeeRulesAcknowledgement8: "कर्मचाही को रोजगार प्रावधानकता के अनुसार वार्षिक अवकाश मिलेगा।.",
            employeeSignature: "कामगार का हस्ताक्षर",
            employeeSignatureAcknowledgement: "मैंने उपरोक्त वर्णित सभी नियम ध्यान से पढ़ एवं समझ लिए हैं तथा इनके पालन का मैं वचन देता हूँ.",
            employeeSignatureAcknowledgementHead: "मानव संसाधन विभाग में जमा करने हेतु प्रमाण-पत्रों की प्रति: ",
            documentSubmissionInstructions1: "1) आवेदन पत्र तथा पासपोर्ट साईज फोटो ",
            documentSubmissionInstructions2: "2) आधार कार्ड की कॉपी तथा स्थाई पते का प्रमाण",
            documentSubmissionInstructions3: "3) शैक्षिणिक तथा अनुभव प्रमाण पत्र ",
            documentSubmissionInstructions4: "4) पैन कार्ड और बैंक पासबुक की कॉपी"
        },
        gujarati: {
            language: 'ભાષા',
            forOfficeHeader: '(ફક્ત કાર્યાલય માટે)',
            dateOfBirth: 'જન્મ તારીખ',
            maritalStatus: 'વૈવાહિક સ્થિતિ',
            // numberOfChildren: 'પરિણીત હોય તો બાળકોની સંખ્યા',
            bloodGroup: 'રક્ત ગ્રુપ',
            mobileNo: 'મોબાઇલ નંબર',
            // emergencyMobileNo: 'આપાતકાલીન મોબાઇલ નં.',
            aadharNo: 'આધાર નંબર',
            panCardNo: 'પાન કાર્ડ નંબર',
            referencePersonName: 'પહોચ કરનારાંનું નામ',
            referencePersonMobile: 'તેમનો મોબાઇલ નંબર',
            companyName: 'કંપનીનું નામ',
            post: 'પોસ્ટ',
            workPeriod: 'કામનું અવધિ',
            lastSalary: 'છેલ્લી પગાર',
            course: 'અભ્યાસ',
            passYear: 'ઉત્તીર્ણ વર્ષ',
            board: 'બોર્ડ / Board:',
            percentage: 'પ્રતિશત',
            formHeader: 'કામગારોને ભરતી કરવા માટેનો અરજી ફોર્મ',
            fullName: 'નામ (પૂરો)',
            permanentAddress: 'સ્થાયી સરનામું',
            educationalDetails: 'શૈક્ષણિક વિગતો',
            workExperience: 'કાર્ય અનુભવ',
            referenceDetails: 'સંદર્ભ વિગતો',
            employeeRules: "કામગારોને માટે નોકરીના નિયમો",
            employeeRulesDetails1: "કામગારોને હાજરી પંચિંગ મશીન દ્વારા લીધી જશે",
            //  જો પંચિંગ ભૂલાઈ જાય, તો તે દિવસની અનુપસ્થિતિ ગણાઈ જશે અને પછી કોઈ પ્રકારની સુનાવણી નહીં થશે।",
            // employeeRulesDetails2: "સમયમાં કાર્ય પર આવો, દેરીથી આવો, જલદી ચલો અથવા કાર્યસ્થળમાં અનુપસ્થિત રહેવાથી વેતનમાં કટૂતી થશે. વિભાગના અધિકારીની સૂચના પ્રમાણે પારી બદલી થઈ શકે છે. પારી સમય પહેલાં 10 મિનિટ આવો।",
            employeeRulesDetails3: "અવકાશ પર જવામાં વખત લઇ તો સમયપાલક કાર્યાલયથી અવકાશની પરવાનગી પત્ર લઇ વિભાગના અધિકારીને સહીની કરવાનું અને સમયપાલક કાર્યાલયમાં જમા કરવું।",
            employeeRulesDetails4: "અવકાશ પર જવાની પહેલાં ન્યુનતમ એક દિવસ પૂર્વે સૂચવવું જરૂરી છે.",
            //  જો અવકાશ 8 દિવસથી વધુ છે, તો વિભાગના અધિકારી પરવાનગી લેવી જરૂરી છે. જો 8 દિવસ કરતા વધુ અનુપસ્થિત રહેવું હોય, તો તેને નિષ્કર્ષિત કરી શકાય છે।",
            employeeRulesAcknowledgement: "મધ્યાહ્ન ભોજન અવકાશનો સમય (40 મિનિટ) પૂર્ણ થયા પછી કાર્યસ્થળ પર આવો।",
            employeeRulesAcknowledgement2: "પ્રતિ મહિને કેટલાક દિવસ કામ કર્યા છે, તેવા દિવસોનું વેતન મળશે.",
            employeeRulesAcknowledgement3: "પ્રતિ મહિને વેતન સમયને અનુસરી અને બેંક એકાઉન્ટમાં જમા થશે.",
            employeeRulesAcknowledgement4: "વેતન વૃદ્ધિ કાર્યકુશળતા અને કંપનીના નિયમોના અનુસાર થશે.",
            employeeRulesAcknowledgement5: "નોકરી છોડવાથી એક મહિના પહેલાં રાજી કરવા માટે રાજીનામું આપવું જરૂરી છે, અન્યથા એક મહિનાની વેતનની કટૂતી થશે.",
            // employeeRulesAcknowledgement6: "જો બે વર્ષ પહેલાં નોકરી છોડશે તો મળેલી વેતનની કટૂતી પાછા કરવામાં નહીં આવશે.",
            employeeRulesAcknowledgement6: "૬ દિવસ બાદ ૧ દિવસ આરામ આપવામાં આવશે. તે વિભાગ દ્વારા નક્કી કરવામાં આવશે.",
            employeeRulesAcknowledgement7: "કર્મચારીને રાજ્યના આદેશમાં ઉલ્લેખિત રજાઓ અનુસાર રજા આપવામાં આવશે.",
            employeeRulesAcknowledgement8: "કર્મચારીને નોકરી પ્રદાતાની જોગવાઇઓ અનુસાર વાર્ષિક રજા મળશે.",
            employeeSignature: "કામદારની સહી",
            employeeSignatureAcknowledgement: "હું ઉપરની વર્ણિત બધા નિયમોને ધ્યાનથી વાંચ્યા અને સમજ્યા છે અને તેના પાલનની માર્ગદર્શિકા આપી છું.",
            employeeSignatureAcknowledgementHead: "માનવ સંસાધન વિભાગમાં જમા કરવા માટે પ્રમાણ-પત્રોની પ્રતિ: ",
            documentSubmissionInstructions1: "1) અરજી પત્ર અને પાસપોર્ટ સાઇઝ ફોટો",
            documentSubmissionInstructions2: "2) આધાર કાર્ડની કૉપી અને સ્થાયી પત્રનું પ્રમાણ",
            documentSubmissionInstructions3: "3) શૈક્ષણિક અને અનુભવ પ્રમાણપત્ર",
            documentSubmissionInstructions4: "4) પેન કાર્ડ અને બેંક પાસબુકની કૉપી"
        },
    };


    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    };

    const currentLabels = labels[currentLanguage] || labels.hindi;

    const isImageAvailable = uploadImage !== undefined && uploadImage !== null && uploadImage !== '';

    const employeePrintHeader = (
        <>
            <div className="bordered border-1 px-0" style={{ pageBreakAfter: 'always' }}>
                <div className="col-sm-12 d-flex justify-content-between" style={{ height: '1.3in' }}>
                    <div className="col-sm-2 p-2">
                        <img src={DakshabhiLogo} alt="master card" width="170px" height="auto" mt={1} />
                    </div>
                    <div className="col-sm-8 text-center">
                        <div className='erp-invoice-print-label'>
                            <span className='erp-invoice-print-label-lg'>{employeeDataForPrint.company_name}</span><br />
                            <span className='erp-invoice-print-label-md'>({employeeDataForPrint.company_branch_name})</span>
                        </div>
                        <div className="erp-invoice-print-label-lg mt-3" >{currentLabels.formHeader} / Application Form for Workers</div>
                    </div>
                    <div className="col-sm-2 d-flex flex-column align-items-end">
                        {isImageAvailable ? (
                            <img
                                src={uploadImage}
                                className="card-img-top"
                                style={{ width: '130px', height: 'auto', borderRight: '1px solid #000', borderLeft: '1px solid #000' }}
                            />
                        ) : (
                            <img
                                src={EmployeeLogo}
                                alt="master card"
                                assName="card-img-top"
                                style={{ width: '135px', height: 'auto', borderRight: '1px solid #000', borderLeft: '1px solid #000' }}
                            />
                        )}
                    </div>

                </div>


                <div className="row" style={{ padding: '0px 11px 5px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >

                                            <tbody>

                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-4">{currentLabels.fullName} / Name (Full):</th>
                                                    <td className="erp-invoice-print-label col-8">{employeeDataForPrint.employee_name}</td>
                                                </tr>



                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-4">{currentLabels.permanentAddress} / Permanent Address:</th>
                                                    <td className="erp-invoice-print-label col-8">{employeeDataForPrint.permanant_address}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ padding: '0px 11px 10px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0">
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable'>
                                            <thead>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-2">{currentLabels.dateOfBirth} / Date of Birth :</th>
                                                    <td className="erp-invoice-print-label col-2">{formatDate(employeeDataForPrint.date_of_birth)}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">{currentLabels.maritalStatus} /Marital Status:</th>
                                                    <td className="erp-invoice-print-label col-2">{employeeDataForPrint.marital_status}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">{currentLabels.bloodGroup}  / Blood Group :</th>
                                                    <td className="erp-invoice-print-label col-2">{employeeDataForPrint.blood_group}</td>
                                                </tr>
                                                {/* <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-4">{currentLabels.numberOfChildren} / Number of Children :</th>
                                                    <td className="erp-invoice-print-label col-2">{employeeDataForPrint.number_of_children}</td>
                                                   
                                                </tr> */}
                                                {/* <tr>
                                                  
                                                    <th className="erp-invoice-print-label-md-lg col-3">{currentLabels.emergencyMobileNo} / Emergency Mobile No :</th>
                                                    <td className="erp-invoice-print-label col-3">{employeeDataForPrint.cell_no2}</td>
                                                </tr> */}
                                                <tr>
                                                <th className="erp-invoice-print-label-md-lg col-2">{currentLabels.mobileNo} / Mobile No :</th>
                                                <td className="erp-invoice-print-label col-2">{employeeDataForPrint.cell_no1}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">{currentLabels.aadharNo} / Aadhar No :</th>
                                                    <td className="erp-invoice-print-label col-2">{employeeDataForPrint.aadhar_card_no}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-2">{currentLabels.panCardNo} / Pan Card No :</th>
                                                    <td className="erp-invoice-print-label col-2">{employeeDataForPrint.pan_no}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ marginLeft: '-7px' }}>
                    <div className="col-sm-6">
                        <dt className="erp-invoice-print-label-md-lg">{currentLabels.educationalDetails} / Educational Details :</dt>
                    </div>
                </div>

                <div className="row" style={{ padding: '0px 11px 10px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >

                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >
                                            <thead>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg  col-2" rowspan={2}>{currentLabels.course} / Course :</th>
                                                    <th className="erp-invoice-print-label-md-lg  col-3" rowspan={2}>{currentLabels.passYear} / Pass Years:</th>
                                                    <th className="erp-invoice-print-label-md-lg  col-4" rowspan={2}>{currentLabels.board} / Board :</th>
                                                    <th className="erp-invoice-print-label-md-lg  col-3" rowspan={2}>{currentLabels.percentage} / Percentage(%):</th>
                                                </tr>

                                            </thead>

                                            <tbody>
                                                {educationData.length > 0 ? (
                                                    educationData.map((item, index) => (
                                                        <tr key={index} style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label">{item.qualification}</td>
                                                            <td className="erp-invoice-print-label">{item.passing_year}</td>
                                                            <td className="erp-invoice-print-label">{item.board_university}</td>
                                                            <td className="erp-invoice-print-label">{item.mark_percentage}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <>
                                                        <tr style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                        </tr>
                                                        <tr style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                        </tr>
                                                        <tr style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                        </tr>

                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="row" style={{ marginLeft: '-7px' }}>
                    <div className="col-sm-6">
                        <dt className="erp-invoice-print-label-md-lg">{currentLabels.workExperience} / Work Experience :</dt>
                    </div>
                </div>

                <div className="row" style={{ padding: '0px 11px 10px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0 border-left-0 border-right-0" id='invoiceTable' >
                                            <thead>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-4">{currentLabels.companyName} / Company Name:</th>
                                                    <th className="erp-invoice-print-label-md-lg col-3">{currentLabels.post}/ Post :</th>
                                                    <th className="erp-invoice-print-label-md-lg col-3"> {currentLabels.workPeriod} / Work Period :</th>
                                                    <th className="erp-invoice-print-label-md-lg col-3"> {currentLabels.lastSalary} / Last Salary :</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {workExperienceData.length > 0 ? (
                                                    workExperienceData.map((item, index) => (
                                                        <tr key={index} style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label col-4">{item.previous_organisation}</td>
                                                            <td className="erp-invoice-print-label col-3">{item.desigantion}</td>
                                                            <td className="erp-invoice-print-label col-3">{item.working_experience}</td>
                                                            <td className="erp-invoice-print-label col-3">{item.previous_salary}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <>
                                                        <tr style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label "></td>
                                                            <td className="erp-invoice-print-label"></td>
                                                            <td className="erp-invoice-print-label "></td>
                                                            <td className="erp-invoice-print-label "></td>

                                                        </tr>
                                                        <tr style={{ height: "25px" }}>
                                                            <td className="erp-invoice-print-label "></td>
                                                            <td className="erp-invoice-print-label "></td>
                                                            <td className="erp-invoice-print-label "></td>
                                                            <td className="erp-invoice-print-label "></td>

                                                        </tr>

                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div>
            <div className="bordered border-bottom-0 px-0"> */}
                <div className="row" style={{ marginLeft: '-7px' }}>
                    <div className="col-sm-6">
                        <dt className="erp-invoice-print-label-md-lg"  >{currentLabels.referenceDetails} / Reference Details :</dt>
                    </div>
                </div>
                <div className="row" style={{ padding: '0px 11px 0px', marginBottom: '-2px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >

                                            <tbody>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-4">{currentLabels.referencePersonName} / Name of Reference person :</th>
                                                    <td className="erp-invoice-print-label col-8">{employeeDataForPrint.reference}</td>
                                                </tr>

                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-3">{currentLabels.referencePersonMobile} / Mobile Details :</th>
                                                    <td className="erp-invoice-print-label col-9"></td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="row" style={{ marginLeft: '-7px', marginBottom: '5px', marginTop: '10px' }}>
                    <div className="col">
                        <dt className="erp-invoice-print-label-md-lg text-center">{currentLabels.forOfficeHeader} / (For Office Use Only)</dt>
                    </div>

                </div>
                <div className="row" style={{ padding: '0px 11px 5px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >

                                            <tbody>

                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-4">Name of Company Selected For:</th>
                                                    <td className="erp-invoice-print-label col-8"></td>
                                                </tr>



                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-4">PCL / PFLLP / PCY / Other Specify:</th>
                                                    <td className="erp-invoice-print-label col-8">{employeeDataForPrint.company_name}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ padding: '0px 11px 15px' }}>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 px-0" >
                                <div className="row p-0">
                                    <div className="table-responsive">
                                        <table className="table table-bordered border border-dark m-0 border-end-0 border-start-0" id='invoiceTable' >

                                            <thead>

                                            </thead>
                                            <tbody>

                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-3">Department:</th>
                                                    <td className="erp-invoice-print-label col-3">{employeeDataForPrint.department_name}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-3">Designation:</th>
                                                    <td className="erp-invoice-print-label col-3">{employeeDataForPrint.designation_name}</td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-3">Joining From dt:</th>
                                                    <td className="erp-invoice-print-label col-3">{formatDate(employeeDataForPrint?.date_joining)}</td>
                                                    <th className="erp-invoice-print-label-md-lg col-3">Employee Code No:</th>
                                                    {/* <td className="erp-invoice-print-label col-3">{employeeDataForPrint.employee_code}</td> */}
                                                    <td className="erp-invoice-print-label col-3"></td>

                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-3">Per Day Salary:</th>
                                                    <td className="erp-invoice-print-label col-3"></td>
                                                    <th className="erp-invoice-print-label-md-lg col-3">Colony Offered:</th>
                                                    <td className="erp-invoice-print-label col-3"></td>
                                                </tr>
                                                <tr>
                                                    <th className="erp-invoice-print-label-md-lg col-3">Working HRs:</th>
                                                    {/* <td className="erp-invoice-print-label col-3"> [{employeeDataForPrint.shift_start_end_time}]</td> */}
                                                    <td className="erp-invoice-print-label col-3"> </td>
                                                    <th className="erp-invoice-print-label-md-lg col-3">Shift:</th>
                                                    {/* <td className="erp-invoice-print-label col-3">{employeeDataForPrint.shift_name}</td> */}
                                                    <td className="erp-invoice-print-label col-3"></td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="row p-0 m-0">

                    <div className="row">

                        <div className='col-4'>
                            <dt className="erp-invoice-print-label-md-lg text-center">HR :-</dt>
                        </div>
                        <div className='col-4'>
                            <dt className="erp-invoice-print-label-md-lg text-center">HOD :-</dt>
                        </div>
                        <div className='col-4'>
                            <dt className="erp-invoice-print-label-md-lg text-center">VP :-</dt>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1st page complete */}
            < div className="bordered border-1 px-0" >

                <div className="row p-0 m-0">
                    <span className="erp-invoice-print-label text-center" style={{ textDecoration: 'underline', fontWeight: 700, marginTop: '10px' }}>{currentLabels.employeeRules}</span>
                    <ul style={{ listStyleType: 'disc', marginLeft: '20px', marginRight: '20px', width: 'fit-content' }}>
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesDetails1}</span></li>
                        {/* <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesDetails2}</span></li> */}
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesDetails3}</span></li>
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesDetails4}</span></li>
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesAcknowledgement}</span></li>
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesAcknowledgement2}</span></li>
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesAcknowledgement3}</span></li>
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesAcknowledgement4}</span></li>
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesAcknowledgement5}</span></li>
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesAcknowledgement6}</span></li>
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesAcknowledgement7}</span></li>
                        <li><span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeRulesAcknowledgement8}</span></li>
                    </ul>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeSignatureAcknowledgement}</span>
                    <span className="erp-invoice-print-label mt-5 text-end" style={{ textDecoration: 'underline', fontWeight: 700 }}>{currentLabels.employeeSignature}</span>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.employeeSignatureAcknowledgementHead}</span>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.documentSubmissionInstructions1}

                    </span>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.documentSubmissionInstructions2}

                    </span>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.documentSubmissionInstructions3}
                    </span>
                    <span className="erp-invoice-print-label" style={{ fontWeight: 700 }}>{currentLabels.documentSubmissionInstructions4}
                    </span>
                </div>

            </div>
            {/* </div > */}

            <hr className="m-0 p-0 hr-line" />

        </>
    );

    return (

        <>
            <style>
                {`
                .erp-invoice-print-label-md-lg,
                .erp_invoice_table_td,
                .erp-invoice-print-label {
                    font-size: 13px;
                }
                `}
            </style>
            <div className="">
                <div className="row">
                    <div className="col-12">
                        <div className="container-invoice py-3">
                            <div id="content">
                                <div className="invoice p-0">

                                    {/* <div  className={`row ${isPrinting ? 'hide' : 'show'}`} >

                                        <div className="col-8">
                                        </div>
                                        <div className="col-sm-2 text-end">
                                            <Form.Label className="erp-form-label text-end"> {currentLabels.language} / Language :</Form.Label>
                                        </div>
                                        <div className="col-2  text-end">
                                            <select className="form-select form-select-sm" value={currentLanguage} onChange={handleLanguageChange}>
                                                <option value="hindi">हिंदी</option>
                                                <option value="gujarati">ગુજરાતી</option>
                                            </select>

                                        </div>
                                    </div> */}
                                    {/* <div className="col-2">
                                    <select  className="form-select form-select-sm text-end" value={currentLanguage} onChange={handleLanguageChange}> */}
                                    {/* <option value="english">English</option> */}
                                    {/* <option value="hindi">हिंदी</option>
                                        <option value="gujarati">ગુજરાતી</option>
                                    </select>
                                    </div> */}
                                    <div className="row" style={{ padding: '0px 15px 0px' }}>
                                        {employeePrintHeader}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MEmployeeWorkerPrint;

