import React, {useEffect, useState} from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";
import {
  Form,FormGroup,Input,Button,Modal,Label,Collapse
} from "reactstrap";
import Nimonemo_terms from 'assets/Nimonemo_terms.pdf';

const nickname = sessionStorage.getItem("nickname");
const requiredMessage = `필수 응답란입니다.`;
const warningStyle = {
  color: 'red'
};
const agreeMessage = `서비스에 동의하셔야만 서비스 제공이 가능합니다.`;

const schema = yup.object().shape({
  questGender : yup.string().required(requiredMessage),
  questOld : yup.string().required(requiredMessage),
  questUsageTerm : yup.string().required(requiredMessage),
  questPermTerm : yup.string().required(requiredMessage),
  questDyeTerm : yup.string().required(requiredMessage),
  questRecommend : yup.number().required(requiredMessage),
  questReuseImage : yup.number().required(requiredMessage),
//
});



function SurveyForm() {
  const [showModal, setShowModal] = useState(false);
  // 모달을 사용하기 위한 state

  const [rememberAnswer, setRememberAnswer] = useState(true);
  // 기억 체크박스를 위해

  const [agreementOfTerm, setAgreementOfTerm] = useState(false);

  const [rememberGender, setRememberGender] = useState(sessionStorage.getItem("Qgender") ? sessionStorage.getItem("Qgender") : "");
  const [rememberOld, setRememberOld] = useState(sessionStorage.getItem("Qold") ? sessionStorage.getItem("Qold") : "");
  const [rememberUsageTerm, setRememberUsageTerm] = useState(sessionStorage.getItem("Quse_age_term") ? sessionStorage.getItem("Quse_age_term") : "");
  const [rememberPermTerm, setRememberPermTerm] = useState(sessionStorage.getItem("Qperm_term") ? sessionStorage.getItem("Qperm_term") : "");
  const [rememberDyeTerm, setRememberDyeTerm] = useState(sessionStorage.getItem("Qdye_term") ? sessionStorage.getItem("Qdye_term") :"");
  const [rememberRecommend, setRememberRecommend] = useState(sessionStorage.getItem("Qrecommend_or_not") ? sessionStorage.getItem("Qrecommend_or_not") : 1);
  const [rememberReuseImage, setRememberReuseImage] = useState(sessionStorage.getItem("Qreuse_image") ? sessionStorage.getItem("Qreuse_image") : 1);
  const [rememberAgreement, setRememberAgreement] = useState(sessionStorage.getItem("Qagreement") ? sessionStorage.getItem("Qagreement") : false);
  // 기억요소..


  const { control, handleSubmit, setValue, formState: {errors}, watch } = useForm({
    resolver: yupResolver(schema),
  }); // 폼 제어(필수입력 등) 사용하기 위한 메서드 집합들. 핵심은 yup임.
  
  const onSubmit = async (data) => {
    if(rememberAnswer){
      sessionStorage.setItem("Qgender", data.questGender);
      sessionStorage.setItem("Qold", data.questOld);
      sessionStorage.setItem("Quse_age_term", data.questUsageTerm);
      sessionStorage.setItem("Qperm_term", data.questPermTerm);
      sessionStorage.setItem("Qdye_term", data.questDyeTerm);
      sessionStorage.setItem("Qrecommend_or_not", data.questRecommend);
      sessionStorage.setItem("Qreuse_image", data.questReuseImage);
      sessionStorage.setItem("Qagreement", data.questAgree);
    }else{
      sessionStorage.removeItem("Qgender");
      sessionStorage.removeItem("Qold");
      sessionStorage.removeItem("Quse_age_term");
      sessionStorage.removeItem("Qperm_term");
      sessionStorage.removeItem("Qdye_term");
      sessionStorage.removeItem("Qrecommend_or_not");
      sessionStorage.removeItem("Qreuse_image");
      sessionStorage.removeItem("Qagreement");
    }

    let formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("gender", data.questGender);
    formData.append("old", data.questOld);
    formData.append("use_age_term", data.questUsageTerm);
    formData.append("perm_term", data.questPermTerm);
    formData.append("dye_term", data.questDyeTerm);
    formData.append("recommend_or_not", data.questRecommend);
    formData.append("reuse_image", data.questReuseImage);
    
    sessionStorage.setItem("recommend_or_not", data.questRecommend);
    sessionStorage.setItem("old", data.questOld);

    await axios.post('http://3.34.182.50:5000/survey', formData)
      .then(function(response) {

        // image-upload 페이지 접근제어
        sessionStorage.setItem('valid', 'true'); // 설문조사 업로드 성공시 valid를 true 바꾸기 
        
        window.location.href = '/file-upload';
      })
      .catch(function(error) {
        alert("설문조사 폼 제출에 실패했습니다.");
      });
    /*
     * gender
     * old
     * use_age_term
     * perm_term
     * dye_term
     * recommend_or_not
     */
  };  // '제출' 버튼을 클릭했을때 발생하는 것들.

  useEffect(() => {
    if (watch('questRecommend') == 0) {
      setShowModal(true);
    }
  }, [watch('questRecommend')]);

  const handleYesButtonClick = () => {
    setShowModal(false);
  };

  const handleNoButtonClick = () => {
    setValue('questRecommend', 1);
    setShowModal(false);
  };

  const btnStyle = {
    background:"#90d8de",
    border:"1px solid #fff",
    width:"100%",
    height:"50px",
    color: "#fff",
    fontWeight:600,
    fontSize:"14px",
    textAlign: "center"
  }

  return (
    <div style={{display:'flex'}}>
      <Form onSubmit={handleSubmit(onSubmit)}>
        
        <Modal isOpen={showModal}>
        <div className="modal-header">
          <h2 className="modal-title" id="exampleModalLiveLabel">
            알림
          </h2>
        </div>
        <div className="modal-body">
          <p>정말 헤어케어 제품을 추천받지 않으시겠어요?</p>
        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            type="button"
            onClick={() => {
              handleYesButtonClick();
              setShowModal(false);
            }}>
            받지 않겠습니다
          </Button>
          <Button
            color="info"
            type="button"
            onClick={() => {
              setShowModal(false);
              handleNoButtonClick();
            }}>
            추천 받겠습니다
          </Button>
        </div>
        </Modal>
      
      
        <h1 className='title'>✔ 설문 조사</h1>
        <p style={{justifyContent: 'center', width: '100%'}}>보다 정확한 진단을 위해 필요하니 응답해주시면 감사하겠습니다.<br></br>
        <span style={{color:'red'}}>별 표시( * )가 있는 항목은 필수응답 항목입니다.</span></p>
        <br></br>
        
        <div>
          <FormGroup>
            <p> * 성별을 알려주세요.</p>
            <Controller
                name="questGender" // 이름은 유일해야 합니다.
                control={control} // useForm에서 받은 control을 전달합니다.
                defaultValue={rememberGender} // 기본값을 설정할 수 있습니다.
                render={({ field }) => (
                  <div>
                    <select {...field} className="form-control-lg" style={{ width: '100%' }}>
                      <option value="" disabled>선택해주세요</option>
                      <option value="남자">남자</option>
                      <option value="여자">여자</option>
                      {/* 추가적인 선택 옵션을 필요에 따라 추가할 수 있음 */}
                    </select>
                  </div>
                )}
              />
            {errors.questGender && <p style={warningStyle}>{errors.questGender.message}</p>}
          </FormGroup>
        </div>

        <br></br>

        <div>
          <FormGroup>
            <p> * 연령대를 알려주세요.</p>
            <Controller
              name="questOld"
              control={control}
              defaultValue={rememberOld}
              render={({ field }) => (
                <div>
                  <select {...field} className="form-control-lg" style={{ width: '100%' }}>
                    <option value="" disabled>선택해주세요</option>
                    <option value="0대">10대미만</option>
                    <option value="10대">10대</option>
                    <option value="20대">20대</option>
                    <option value="30대">30대</option>
                    <option value="40대">40대</option>
                    <option value="50대">50대</option>
                    <option value="60대">60대</option>
                    <option value="70대">70대</option>
                    <option value="80대">80대</option>
                    {/* 추가적인 선택 옵션을 필요에 따라 추가할 수 있음 */}
                  </select>
                </div>
              )}/>
            {errors.questOld && <p style={warningStyle}>{errors.questOld.message}</p>}
          </FormGroup>
        </div>
        <br></br>
        
        <div>
          <FormGroup>
            <p> * 샴푸 사용빈도를 알려주세요.</p>
            <Controller
              name="questUsageTerm"
              control={control}
              defaultValue={rememberUsageTerm}
              render={({ field }) => (
                <div>
                  <select {...field} className="form-control-lg" style={{ width: '100%' }}>
                    <option value="" disabled>
                      선택해주세요
                    </option>
                    <option value="사용하지 않음">사용하지 않음</option>
                    <option value="하루 1회 미만">하루 1회 미만</option>
                    <option value="하루 1회">하루 1회</option>
                    <option value="하루 2회">하루 2회</option>
                    <option value="하루 2회 이상">하루 2회 이상</option>
                    {/* 추가적인 선택 옵션을 필요에 따라 추가할 수 있음 */}
                  </select>
                </div>
              )}/>
            {errors.questUsageTerm && <p style={warningStyle}>{errors.questUsageTerm.message}</p>}
          </FormGroup>
        </div>
        <br></br>

        <div>
          <FormGroup>
            <p> * 파마 주기를 알려주세요.</p>
            <Controller
              name="questPermTerm"
              control={control}
              defaultValue={rememberPermTerm}
              render={({ field }) => (
                <div>
                  <select {...field} className="form-control-lg" style={{ width: '100%' }}>
                    <option value="" disabled>
                      선택해주세요
                    </option>
                    <option value="파마를 하지 않음">파마를 하지 않음</option>
                    <option value="한달에 1번">한달에 1번</option>
                    <option value="분기(3개월)당 1회">분기(3개월)당 1회</option>
                    <option value="1년에 2회">1년에 2회</option>
                    <option value="1년에 1회">1년에 1번</option>
                    {/* 추가적인 선택 옵션을 필요에 따라 추가할 수 있음 */}
                  </select>
                </div>
              )}/>
            {errors.questPermTerm && <p style={warningStyle}>{errors.questPermTerm.message}</p>}
          </FormGroup>
        </div>
        <br></br>

        <div>
          <FormGroup>
            <p> * 염색 주기를 알려주세요.</p>
            <Controller
              name="questDyeTerm"
              control={control}
              defaultValue={rememberDyeTerm}
              render={({ field }) => (
                <div>
                  <select {...field} className="form-control-lg" style={{ width: '100%' }}>
                    <option value="" disabled>
                      선택해주세요
                    </option>
                    <option value="염색을 하지 않음">염색을 하지 않음</option>
                    <option value="한달에 1번">한달에 1번</option>
                    <option value="분기(3개월)당 1회">분기(3개월)당 1회</option>
                    <option value="1년에 2회">1년에 2회</option>
                    <option value="1년에 1회">1년에 1번</option>
                    {/* 추가적인 선택 옵션을 필요에 따라 추가할 수 있음 */}
                  </select>
                </div>
              )}/>
            {errors.questDyeTerm && <p style={warningStyle}>{errors.questDyeTerm.message}</p>}
          </FormGroup>
        </div>
        <br></br>

        <div>
          <FormGroup>
            <p>헤어케어 제품을 추천받으시겠습니까?</p>
            <Controller
              name="questRecommend"
              control={control}
              defaultValue={rememberRecommend}
              render={({ field }) => (
                <div>
                  <select {...field} className="form-control-lg" style={{ width: '100%' }}>
                    <option value={1}>추천을 받겠습니다.</option>
                    <option value={0}>추천을 받지 않겠습니다.</option>
                    {/* 추가적인 선택 옵션을 필요에 따라 추가할 수 있음 */}
                  </select>
                  {/* 추가적인 체크 박스 옵션을 필요에 따라 추가할 수 있음 */}
                </div>
              )}
            />
            {errors.questRecommend && <p style={warningStyle}>{errors.questRecommend.message}</p>}
          </FormGroup>
        </div>
        
        <br></br>

        <div>
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={rememberAnswer}
                onChange={() => setRememberAnswer(!rememberAnswer)}
              />
              <span className="form-check-sign">로그아웃시까지 이번 설문응답을 기억합니다.</span>
            </Label>
          </FormGroup>
        </div>

        <div>
          <FormGroup check>
            <Controller
              name="questAgree"
              control={control}
              defaultValue={rememberAgreement}
              render={({ field }) => (
                <div>
                  <Label check>
                    <Input
                      id="agreeCheckbox"
                      type="checkbox"
                      checked={agreementOfTerm}
                      onChange={() => setAgreementOfTerm(!agreementOfTerm)}
                    />
                    <span className="form-check-sign">두피체크 약관에 동의합니다.　
                    </span>
                  </Label>
                  <a
                        onClick={() => {
                          window.open(Nimonemo_terms, "_blank", "noopener, noreferrer");
                        }}
                        style={{ textDecoration: 'underline' }}
                      >
                        약관보기
                  </a>
                </div>
              )}
            />
          </FormGroup>
        </div>


        <div>
          <FormGroup check>
            <Controller
              name="questReuseImage"
              control={control}
              defaultValue={rememberReuseImage}
              render={({ field }) => (
                <Label check>
                  <Input
                    type="checkbox"
                    {...field}
                    checked={field.value == 1} // Check if the value is 1
                    onChange={(e) => field.onChange(e.target.checked ? 1 : 0)} // Toggle between 1 and 0
                  />
                  <span className="form-check-sign">서비스 개선을 위한 이미지 제공에 동의합니다.</span>
                </Label>
              )}
            />
          </FormGroup>
        </div>
        
        <div>
          <Button 
            type="submit" 
            block
            className="btn-icon btn-round" 
            style={btnStyle}
            disabled={!rememberAgreement}
            >
            제출하기
          </Button>
          {                  
            <Collapse isOpen={!rememberAgreement}>
              <span style={warningStyle}>이용약관 미동의시, 서비스 이용이 불가능합니다.</span>
            </Collapse>          
            }
        </div>
      </Form>
    </div>

  );
}

export default SurveyForm;