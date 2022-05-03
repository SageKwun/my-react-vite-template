import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import MajorPicker from "./components/major-picker";
import { Table, Form, Input, Button, notification, Modal, Select } from "antd";

const App = () => {
  const { confirm } = Modal;
  const { Option } = Select;

  // 新增的学校、专业、课程、学分
  const [newSchool, setNewSchool] = useState("");
  const [newMajor, setNewMajor] = useState("");
  const [newCurriculumName, setNewCurriculumName] = useState("");
  const [newCurriculumCredit, setNewCurriculumCredit] = useState();

  const [majors, setMajors] = useState([]); // 所有专业
  const [colleges, setColleges] = useState([]); // 所有学校
  const [school1, setSchool1] = useState("");
  const [school2, setSchool2] = useState("");
  const [major1, setMajor1] = useState(); // 学校1的所有专业
  const [major2, setMajor2] = useState();
  const [curriculums1, setCurriculums1] = useState([]); // 专业1的所有课程
  const [curriculums2, setCurriculums2] = useState([]);
  const [savedCurriculums, setSavedCurriculums] = useState([]); // 匹配了的结果
  const [recommend, setRecommend] = useState([]);
  const [pending, setPending] = useState([]); //待匹配的课程1

  const savedColumns = [
    {
      title: "学校1的课程",
      dataIndex: "name1",
      key: "name1",
    },
    {
      title: "课程学分",
      dataIndex: "credit1",
      key: "credit1",
    },
    {
      title: "学校2的课程",
      dataIndex: "name2",
      key: "name2",
    },
    {
      title: "课程学分",
      dataIndex: "credit2",
      key: "credit2",
    },
  ];

  // 生成一个课程的匹配候选项
  const generatePending = (id) => {
    const pendingRecommend = recommend
      .filter((r) => r.id === id)
      .map((r) =>
        r.isGet
          ? { id: r.curriculum2Id, name: r.curriculum2_name }
          : r.recommend
      );
    const otherSchoolCurriculums = curriculums1.filter((c) => c.id === id)
      .length
      ? curriculums2
      : curriculums1;
    return [...pendingRecommend, ...otherSchoolCurriculums];
  };

  const updatePending1 = (v) => {
    setPending(v);
  };

  const BASE_URL = "http://localhost:3031/";

  const getMatch = async () => {
    const data = (
      await axios.get(
        `${BASE_URL}getMatch?college1Id=${major1.id}&college2Id=${major2.id}`
      )
    ).data.data;

    data.forEach((m) => {
      console.log("m: ", m);
      const saved1 = curriculums1.filter((c1) => c1.id === m.id)[0];
      console.log("curriculums1: ", curriculums1);
      console.log("saved1: ", saved1);
      const saved2 = curriculums2.filter((c2) => c2.id === m.curriculum2Id)[0];
      console.log("curriculums2: ", curriculums2);
      console.log("saved2: ", saved2);
      setSavedCurriculums((savedColumns) => [
        ...savedColumns,
        {
          name1: saved1.name,
          credit1: saved1.credit,
          name2: saved2.name,
          credit2: saved2.credit,
        },
      ]);
      setCurriculums1((c1) => c1.filter((c) => c.id !== saved1.id));
      setCurriculums2((c2) => c2.filter((c) => c.id !== saved2.id));
    });
  };

  const getRecommend = async () => {
    const data = (
      await axios.post(
        `${BASE_URL}match?college1Id=${major1.id}&college2Id=${major2.id}`
      )
    ).data.data;
    setRecommend(data);
  };

  const handleSearch = async () => {
    await getMatch();
    await getRecommend();
  };

  const sendMatch = async () => {
    await axios.post(`${BASE_URL}?college1Id=${}&college2Id=${}`, {
      matchList: [];
    });
  }

  useEffect(() => {
    axios.get(`${BASE_URL}getColleges`).then((res) => {
      console.log(res.data.data);
      const data = res.data.data;
      setMajors(data);
      setColleges(Array.from(new Set(data.map((m) => m.name))));
    });
  }, []);

  useEffect(() => {
    major1 &&
      major1.id &&
      axios
        .get(`${BASE_URL}getCurriculums?collegeId=${major1.id}`)
        .then((res) => {
          if (res.data.code === 200) {
            const data = res.data.data;
            console.log("curriculums1 data: ", data);
            setCurriculums1([...data]);
            console.log("c2 after c1: ", curriculums2);
          }
        });
  }, [major1]);

  useEffect(() => {
    major2 &&
      major2.id &&
      axios
        .get(`${BASE_URL}getCurriculums?collegeId=${major2.id}`)
        .then((res) => {
          if (res.data.code === 200) {
            const data = res.data.data;
            console.log("curriculums2 data: ", data);
            setCurriculums2([...data]);
            console.log("c1 after c2: ", curriculums1);
          }
        });
  }, [major2]);

  return (
    <div className='container'>
      <Form>
        <Form.Item label='学校'>
          <Input
            value={newSchool}
            onChange={(e) => {
              setNewSchool(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label='专业'>
          <Input
            value={newMajor}
            onChange={(e) => {
              setNewMajor(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label='课程名'>
          <Input
            value={newCurriculumName}
            onChange={(e) => {
              setNewCurriculumName(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label='课程学分'>
          <Input
            value={newCurriculumCredit}
            onChange={(e) => {
              setNewCurriculumCredit(e.target.value);
            }}
          />
        </Form.Item>
        <Button
          type='primary'
          onClick={(e) => {
            e.preventDefault();
            const l = (i) => i.length;
            if (
              l(newSchool) *
              l(newMajor) *
              l(newCurriculumName) *
              l(newCurriculumCredit)
            ) {
              confirm({
                title: "新增会刷新页面，未确认的匹配会丢失，是否继续？",
                onOk() {
                  axios
                    .post(`${BASE_URL}addCollege`, {
                      name: newSchool,
                      major: newMajor,
                      curriculums: [
                        {
                          name: newCurriculumName,
                          credit: Number(newCurriculumCredit),
                        },
                      ],
                    })
                    .then((res) => {
                      if (res.data.code === 200) {
                        notification.open({
                          message: res.data.msg,
                          description: "即将自动刷新页面",
                        });
                        // setTimeout(() => location.reload(), 10000);
                      }
                    });
                },
                onCancel() {
                  console.log("Cancel");
                },
              });
            }
          }}>
          新增
        </Button>
      </Form>
      <div>
        <MajorPicker
          schoolLabel='学校1'
          schools={colleges}
          school={school1}
          setSchool={setSchool1}
          majors={majors}
          setMajor={setMajor1}
        />
        <MajorPicker
          schoolLabel='学校2'
          schools={colleges}
          school={school2}
          setSchool={setSchool2}
          majors={majors}
          setMajor={setMajor2}
        />
        <Button onClick={handleSearch}>查询</Button>
      </div>
      <Table
        title={() => "已保存的匹配课程"}
        dataSource={savedCurriculums}
        columns={savedColumns}
        pagination={false}
      />
      <Form layout='inline'>
        <Form.Item label='待匹配的课程1'>
          <Select onChange={(e) => updatePending1(e.target.value)}>
            {curriculums1.map((c) => (
              <Option value={c.id} key={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label='待匹配的课程2'>
          <Select>
            {generatePending().map((c) => (
              <Option value={c.id} key={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Button onClick={sendMatch}>匹配</Button>
      </Form>
    </div>
  );
};

export default App;
