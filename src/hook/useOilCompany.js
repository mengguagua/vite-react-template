import { useState, useEffect } from 'react';
import {getOilCompanyName} from "../service/interface";
// 自定义hook，重复查询的逻辑可以提炼成hook
let useOilCompany = (virtualType = '') => {
  let [oilCompanyOption, setOilCompanyOption] = useState([]);
  useEffect(() => { getOilCompanyNameOption(); }, []);

  let getOilCompanyNameOption = () => {
    getOilCompanyName({virtualType: virtualType}).then((resp) => {
      let temp = resp?.data.map((item) => {
        return {
          value: item,
          label: item,
        };
      });
      setOilCompanyOption(temp);
    });
  };
  return { oilCompanyOption };
};

export default useOilCompany;
