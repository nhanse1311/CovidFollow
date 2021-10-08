import './App.css';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Select, Spin } from 'antd';
import { Pie } from '@ant-design/charts';
const axios = require('axios').default;
const { Option } = Select;


const App = () => {
  const [dataCovid, setDataCovid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataPie, setdataPie] = useState(null);
  const [configPie, setconfigPie] = useState({});
  const [selectData, setselectData] = useState(null);
  const [totalInfection, setTotalInfection] = useState(0);
  const [totalInfectionToDay, setTotalInfectionToDay] = useState(0);
  const [totalDieToDay, setTotalDieToDay] = useState(0);
  const [totalDie, setTotalDie] = useState(0);

  useEffect(() => {
    axios.get('https://owsnews.herokuapp.com/covid?fbclid=IwAR2X0hipgGtqBeqewwFO9tHpYj8j8BkGhhrtG1diWq4RkrQdp9AUCX8Zh0o')
      .then(function (response) {
        let listPie = [];
        let totalInfection = 0;
        let totalInfectioTd = 0;
        let totalDie = 0;
        let totalDieTD = 0;
        response?.data?.data.forEach(each => {
          let valuePie = {
            id: each?.tinh,
            data: [
              {
                type: 'Tổng nhiễm',
                value: parseFloat(each?.tong_nhiem?.replace(/\./g, '')),
              },
              {
                type: 'Tổng tử vong',
                value: parseFloat(each?.tong_tuvong?.replace(/\./g, '')),
              }
            ]
          };
          totalInfectioTd += parseFloat(each?.nhiem !== '0' ? each?.nhiem?.substring(1)?.replace(/\./g, '') : 0);
          totalInfection += parseFloat(each?.tong_nhiem !== '0' ? each?.tong_nhiem?.replace(/\./g, '') : 0);
          totalDieTD += parseFloat(each?.tuvong !== '0' ? each?.tuvong?.substring(1)?.replace(/\./g, '') : 0);
          totalDie += parseFloat(each?.tong_tuvong !== '0' ? each?.tong_tuvong?.replace(/\./g, '') : 0);
          listPie.push(valuePie);
        });
        setTotalInfection(totalInfection);
        setTotalInfectionToDay(totalInfectioTd);
        console.log(totalDieTD)
        setTotalDieToDay(totalDieTD);
        setTotalDie(totalDie);
        setDataCovid(response?.data);
        setdataPie(listPie);
      })
      .catch(function (error) {
        setDataCovid(null)
      })
  }, []);

  useEffect(() => {
    if (dataPie && dataCovid) {
      const resultPie = dataPie?.filter(data => data.id === "TP. Hồ Chí Minh");
      let config = {
        appendPadding: 5,
        data: resultPie?.[0]?.data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
          type: 'inner',
          offset: '-30%',
          content: function content(_ref) {
            var percent = _ref.percent;
            return ''.concat((percent * 100).toFixed(0), '%');
          },
          style: {
            fontSize: 14,
            textAlign: 'center',
          },
        },
        interactions: [{ type: 'element-active' }],
      };
      setconfigPie(config);
      setLoading(false);
      const result = dataCovid?.data.filter(data => data.tinh === "TP. Hồ Chí Minh");
      setselectData(result[0])
    }
  }, [dataCovid, dataPie]);

  function onChange(value) {
    const result = dataCovid?.data.filter(data => data.tinh === value);
    setselectData(result[0]);
    const resultPie = dataPie?.filter(data => data.id === value);
    let config = {
      appendPadding: 0,
      data: resultPie?.[0]?.data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.9,
      label: {
        type: 'inner',
        offset: '-30%',
        content: function content(_ref) {
          var percent = _ref.percent;
          return ''.concat((percent * 100).toFixed(0), '%');
        },
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [{ type: 'element-active' }],
    };
    setconfigPie(config)
  }

  const formatValue = (number) => {
    let format = JSON.stringify(number).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    return format;
  };
  return (

    <div className="App">

      <header className="App-header">
        <Spin spinning={loading}>
          <div style={{ padding: '10px' }}>
            {dataCovid?.source_covid}
          </div>

          {
            !loading && dataPie && <div>
              <Select
                showSearch
                style={{ width: 250 }}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={onChange}
                defaultValue="TP. Hồ Chí Minh"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  dataCovid?.data?.map((value, idx) => {
                    return <Option key={idx} value={value.tinh}>{value.tinh}</Option>
                  })
                }
              </Select>
              <div style={{ textAlign: 'left', fontSize: '14px', padding: '20px 20px 0px 20px' }}>
                <div>- Tổng ca nhiễm: </div>
                <div style={{ display: 'flex', textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', width: '50%', fontSize: '18px' }}>{formatValue(totalInfection)}</div>
                  <div style={{ fontWeight: 'bold', width: '50%', fontSize: '18px' }}>{formatValue(totalInfectionToDay)}</div>
                </div>
                <div style={{ display: 'flex', textAlign: 'center' }}>
                  <div style={{ width: '50%', fontSize: '10px' }}>Từ ngày 27/04/2021</div>
                  <div style={{ width: '50%', fontSize: '10px' }}>Hôm nay</div>
                </div>
                <div style={{marginTop:'10px'}}>- Tổng ca tử vong: </div>
                <div style={{ display: 'flex', textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', width: '50%', fontSize: '18px' }}>{formatValue(totalDie)}</div>
                  <div style={{ fontWeight: 'bold', width: '50%', fontSize: '18px' }}>{formatValue(totalDieToDay)}</div>
                </div>
                <div style={{ display: 'flex', textAlign: 'center' }}>
                  <div style={{ width: '50%', fontSize: '10px' }}>Từ ngày 27/04/2021</div>
                  <div style={{ width: '50%', fontSize: '10px' }}>Hôm nay</div>
                </div>
                <div style={{marginTop:'10px'}}>
                  - Số ca nhiếm hôm nay: <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{selectData.nhiem}</span>
                </div>
                <div>
                  - Số ca tử vong hôm nay: <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{selectData.tuvong}</span>
                </div>
              </div>
              <div style={{marginTop:'10px',  fontWeight: 'bold'}}>
                Biểu đồ khu vực
              </div>
              <Pie {...configPie} style={{height:'260px'}}/>
            </div>

          }
        </Spin>
      </header>

    </div>


  );
}

export default App;
