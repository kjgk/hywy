import React from 'react'
import classNames from 'classnames'
import NumberFormat from 'react-number-format'
import {connect} from "dva"
import './pactPrint.css'
import DateFormatter from "../../../compoment/DateFormatter"

const Component = ({
                     location, dispatch, pactPrint, loading,
                   }) => {

  const {pact, accCodeList} = pactPrint

  return (
    <div className="formBox">
      <h4>二0<span id="year" className="width70"></span>年度(<span id="sort" className="width150"></span>) 合同分类台账</h4>
      <div className="nodate">
        <table border="0" cellSpacing="0" cellPadding="0" width="330">
          <tr>
            <td>总编号:</td>
            <td>{pact.serialNo + ' ' + (pact.serialCode || '')}</td>
            <td>分类编号:</td>
            <td>{pact.serialCode || ''}</td>
          </tr>
        </table>
      </div>
      <div className="table">
        <table border="1" cellSpacing="0" cellPadding="0" width="100%">
          <tr>
            <td rowSpan="9" className="content"><b>主要内容:</b>
              <p><span>{pact.subject}</span></p>
            </td>
            <th>名&nbsp;&nbsp;称</th>
            <td colSpan="5">{pact.name}</td>
            <th rowSpan="9" style={{width: '16px'}}>性质及分类</th>
            <th>{accCodeList[0] && accCodeList[0].name}</th>
            <td>{pact.categoryNo && pact.categoryNo === (accCodeList[0] && accCodeList[0].id) && <span className="checked">√</span>}</td>
          </tr>
          <tr>
            <th>期&nbsp;&nbsp;限</th>
            <td colSpan="5">
              <DateFormatter style={{fontWeight: 100, color: '#666'}} value={pact.signDate} pattern="Y  年  MM  月  DD  日"/>
              ~ <DateFormatter style={{fontWeight: 100, color: '#666'}} value={pact.signDate2} pattern="Y  年  MM  月  DD  日"/>
            </td>
            <th>{accCodeList[1] && accCodeList[1].name}</th>
            <td>{pact.categoryNo && pact.categoryNo === (accCodeList[1] && accCodeList[1].id) && <span className="checked">√</span>}</td>
          </tr>
          <tr>
            <th>授权签约人</th>
            <td className="width100">{pact.transactor1}</td>
            <th>签约部门</th>
            <td className="width50"></td>
            <th>批准人</th>
            <td className="width100">{pact.transactor2}</td>
            <th>{accCodeList[2] && accCodeList[2].name}</th>
            <td>{pact.categoryNo && pact.categoryNo === (accCodeList[2] && accCodeList[2].id) && <span className="checked">√</span>}</td>
          </tr>
          <tr>
            <th>履行部门</th>
            <td className="width100"></td>
            <th>签约日期</th>
            <td colSpan="3"><DateFormatter style={{fontWeight: 100, color: '#666'}} value={pact.signDate3} pattern="Y  年  MM  月  DD  日"/></td>
            <th>{accCodeList[3] && accCodeList[3].name}</th>
            <td>{pact.categoryNo && pact.categoryNo === (accCodeList[3] && accCodeList[3].id) && <span className="checked">√</span>}</td>
          </tr>
          <tr>
            <td colSpan="6" rowSpan="2"></td>
            <th>{accCodeList[4] && accCodeList[4].name}</th>
            <td>{pact.categoryNo && pact.categoryNo === (accCodeList[4] && accCodeList[4].id) && <span className="checked">√</span>}</td>
          </tr>
          <tr>
            <th>&nbsp;</th>
            <td></td>
          </tr>
          <tr>
            <th>对方单位</th>
            <td colSpan="3"></td>
            <th>邮&nbsp;&nbsp;编</th>
            <td></td>
            <th>收入性</th>
            <td>
              {pact.payType === 1 && <span className="checked">√</span>}
            </td>
          </tr>
          <tr>
            <th>签约人</th>
            <td></td>
            <th>联系方式</th>
            <td colSpan="3"></td>
            <th>支出性</th>
            <td>
              {pact.payType === 2 && <span className="checked">√</span>}
            </td>
          </tr>
          <tr>
            <th>地&nbsp;&nbsp;址</th>
            <td colSpan="5"></td>
            <th>其&nbsp;&nbsp;他</th>
            <td>
              {pact.payType === 0 && <span className="checked">√</span>}
            </td>
          </tr>
        </table>
        <div className="flexWraper">
          <div>
            <table width="100%" border="1">
              <tr>
                <th className="methodTitle" colSpan="8">收入及收款方式<p className="flright">(总标的：<span className="width100">
                  {pact.payType === 1 && <NumberFormat value={pact.auditSum} displayType={'text'} thousandSeparator={true}/>}
                </span>元)</p></th>
              </tr>
              <tr>
                <td>全年</td>
                <td>半年</td>
                <td>季</td>
                <td>月</td>
                <td>预收</td>
                <td>事后结清</td>
                <td>一次性</td>
                <td>其他</td>
              </tr>
              <tr style={{height: 34}}>
                <td>{pact.payType === 1 && pact.payMode === 1 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 1 && pact.payMode === 2 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 1 && pact.payMode === 3 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 1 && pact.payMode === 4 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 1 && pact.payMode === 5 && <span className="width50">{pact.prePercent + '%'}</span>}</td>
                <td>{pact.payType === 1 && pact.payMode === 6 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 1 && pact.payMode === 7 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 1 && pact.payMode === 0 && <span className="checked">√</span>}</td>
              </tr>
              <tr>
                <td colSpan="2"><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[0] && pact.payments[0].year}</span>年</td>
                <td colSpan="2"><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[1] && pact.payments[1].year}</span>年</td>
                <td><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[2] && pact.payments[2].year}</span>年</td>
                <td><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[3] && pact.payments[3].year}</span>年</td>
                <td><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[4] && pact.payments[4].year}</span>年</td>
                <td><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[5] && pact.payments[5].year}</span>年</td>
              </tr>
              <tr>
                <td colSpan="2"><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[0] && <NumberFormat value={pact.payments[0].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
                <td colSpan="2"><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[1] && <NumberFormat value={pact.payments[1].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
                <td><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[2] && <NumberFormat value={pact.payments[2].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
                <td><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[3] && <NumberFormat value={pact.payments[3].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
                <td><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[4] && <NumberFormat value={pact.payments[4].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
                <td><span className="width50">{pact.payType === 1 && pact.payments && pact.payments[5] && <NumberFormat value={pact.payments[5].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
              </tr>
              <tr>
                <th className="content" colSpan="8" style={{height: '170px'}}><b>变更、接触、纠纷情况：</b>
                  <p><span>{pact.updateNote}</span></p></th>
              </tr>
            </table>
          </div>
          <div>
            <table width="100%" border="1">
              <tr>
                <th className="methodTitle" colSpan="8">支出及付款方式<p className="flright">(总标的：<span className="width70">
                  {pact.payType === 2 && <NumberFormat value={pact.auditSum} displayType={'text'} thousandSeparator={true}/>}
                </span>元)</p></th>
              </tr>
              <tr>
                <td>全年</td>
                <td>半年</td>
                <td>季</td>
                <td>月</td>
                <td>首付</td>
                <td>完工结清</td>
                <td>一次性</td>
                <td>其他</td>
              </tr>
              <tr style={{height: 34}}>
                <td>{pact.payType === 2 && pact.payMode === 1 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 2 && pact.payMode === 2 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 2 && pact.payMode === 3 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 2 && pact.payMode === 4 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 2 && pact.payMode === 5 && <span className="width50">{pact.prePercent + '%'}</span>}</td>
                <td>{pact.payType === 2 && pact.payMode === 6 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 2 && pact.payMode === 7 && <span className="checked">√</span>}</td>
                <td>{pact.payType === 2 && pact.payMode === 0 && <span className="checked">√</span>}</td>
              </tr>
              <tr>
                <td colSpan="2"><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[0] && pact.payments[0].year}</span>年</td>
                <td colSpan="2"><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[1] && pact.payments[1].year}</span>年</td>
                <td><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[2] && pact.payments[2].year}</span>年</td>
                <td><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[3] && pact.payments[3].year}</span>年</td>
                <td><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[4] && pact.payments[4].year}</span>年</td>
                <td><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[5] && pact.payments[5].year}</span>年</td>
              </tr>
              <tr>
                <td colSpan="2"><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[0] && <NumberFormat value={pact.payments[0].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
                <td colSpan="2"><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[1] && <NumberFormat value={pact.payments[1].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
                <td><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[2] && <NumberFormat value={pact.payments[2].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
                <td><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[3] && <NumberFormat value={pact.payments[3].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
                <td><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[4] && <NumberFormat value={pact.payments[4].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
                <td><span className="width50">{pact.payType === 2 && pact.payments && pact.payments[5] && <NumberFormat value={pact.payments[5].total} displayType={'text'} thousandSeparator={true}/>}</span>元</td>
              </tr>
              <tr>
                <th className="content" colSpan="8" style={{height: '170px', position: 'relative'}}>
                  <b>履行评价：</b>
                  <p><span>{pact.remark}</span></p>
                  <p style={{position: 'absolute', bottom: 0, right: '5px'}}>评价人：<span className="width150"></span><span className="width50"></span>年<span
                    className="width50"></span>月<span className="width50"></span>日</p>
                </th>
              </tr>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}

export default connect((models) => {
  return {
    pactPrint: models.pactPrint,
    loading: models.loading,
  }
})(Component)
