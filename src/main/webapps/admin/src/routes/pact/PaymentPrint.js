import React from 'react'
import NumberFormat from 'react-number-format'
import {connect} from "dva"
import './paymentPrint.css'
import DateFormatter from "../../compoment/DateFormatter"

const Component = ({
                     location, dispatch, paymentPrint, loading,
                   }) => {

  const {payment} = paymentPrint

  return (
    <div className="formBox">
      <h4>合同付款审核表</h4>
      <div className="nodate">
        <table border="0" cellSpacing="0" cellPadding="0" width="130">
          <tr>
            <td className="red">No:</td>
            <td className="red">{payment.serialNo}</td>
          </tr>
          <tr>
            <td>日期：</td>
            <td>
              <DateFormatter pattern="Y-MM-DD" value={payment.payDate}/>
            </td>
          </tr>
        </table>
      </div>
      <div className="table">
        <table border="1" cellSpacing="0" cellPadding="0" width="100%">
          <tbody>
          <tr>
            <th rowSpan="2">合同名称</th>
            <td rowSpan="2" colSpan="2">{ payment.projectName + ' ' + payment.pactName}</td>
            <td>{payment.pactNumber}</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <th>对方单位</th>
            <td colSpan="3">{payment['sign' + payment.company]}</td>
          </tr>
          <tr>
            <th>合同金额</th>
            <td className="money">
              <NumberFormat value={payment.pactSum} displayType={'text'} thousandSeparator={true}/>
            </td>
            <th>审核金额</th>
            <td className="money">
              <NumberFormat value={payment.auditSum} displayType={'text'} thousandSeparator={true}/>
            </td>
          </tr>
          <tr>
            <td colSpan="4">
              <table width="100%" className="subTable">
                <tr>
                  <td>序号：{payment.index + 1}</td>
                  <td>日期：<DateFormatter pattern="Y-MM-DD" value={payment.payDate}/></td>
                  <td>申请单号：{payment.warrant}</td>
                  {/*<td>付对方单位</td>*/}
                  {/*<td>房产公司付总公司</td>*/}
                </tr>
                <tr>
                  <td>合计：  <NumberFormat value={payment.payCount} displayType={'text'} thousandSeparator={true}/></td>
                  <td></td>
                  <td></td>
                  {/*<td className="money">0.00</td>*/}
                  {/*<td className="money">0.00</td>*/}
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <th>已付金额</th>
            <td className="money">
              <NumberFormat value={payment.auditSum - payment.balance} displayType={'text'} thousandSeparator={true}/>
            </td>
            <th rowSpan="2">本次申请</th>
            <td rowSpan="2" className="money">
              <NumberFormat value={payment.payCount} displayType={'text'} thousandSeparator={true}/>
            </td>
          </tr>
          <tr>
            <th>余额</th>
            <td className="money">
              <NumberFormat value={payment.balance} displayType={'text'} thousandSeparator={true}/>
            </td>
          </tr>
          <tr>
            <td colSpan="4" style={{height: 70, 'vertical-align': 'top'}}>
              备注
              <br/>
              <div style={{whiteSpace: 'pre'}}>
                {payment.remark}
              </div>
            </td>
          </tr>
          <tr>
            <th height="35">财务审核</th>
            <td></td>
            <th>制单</th>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div className="name">项目投资管理部</div>
    </div>
  )
}

export default connect((models) => {
  return {
    paymentPrint: models.paymentPrint,
    loading: models.loading,
  }
})(Component)
