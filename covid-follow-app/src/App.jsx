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

  useEffect(() => {
    axios.get('https://owsnews.herokuapp.com/covid?fbclid=IwAR2X0hipgGtqBeqewwFO9tHpYj8j8BkGhhrtG1diWq4RkrQdp9AUCX8Zh0o')
      .then(function (response) {
        let listPie = []
        response?.data?.data.forEach(each => {
          let valuePie = {
            id: each?.tinh,
            data: [
              {
                type: 'Tổng nhiễm',
                value: parseFloat(each?.tong_nhiem?.replace(/\./g,'')),
              },
              {
                type: 'Tổng tử vong',
                value: parseFloat(each?.tong_tuvong?.replace(/\./g,'')),
              }
            ]
          };
          listPie.push(valuePie);
        })
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
        appendPadding: 10,
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
      appendPadding: 10,
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

  return (

    <div className="App">

      <header className="App-header">
        <Spin spinning={loading}>
          <div>
            {dataCovid?.source_covid}
          </div>

          {
            !loading && dataPie && <div>
              <Select
                showSearch
                style={{ width: 400 }}
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
                <div>
                  Số ca nhiếm hôm nay: {selectData.nhiem}
                </div>
                <div>
                  Số ca tử vong hôm nay: {selectData.tuvong}
                </div>
              </div>
              <Pie {...configPie} />
            </div>

          }
        </Spin>
      </header>

    </div>


  );
}

export default App;
