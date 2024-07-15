import { useState, useEffect } from 'react';
import {getOilCompanyName} from "../service/interface";

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
