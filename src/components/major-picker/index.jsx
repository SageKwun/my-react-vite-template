import "./index.less";
import { Form, Select } from "antd";

const MajorPicker = ({
  schoolLabel,
  schools,
  school,
  setSchool,
  majors,
  setMajor,
}) => {
  const { Option } = Select;

  return (
    <Form>
      <Form.Item label={schoolLabel}>
        <Select onChange={(v) => setSchool(v)}>
          {schools.map((s) => (
            <Option value={s} key={s}>
              {s}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={`${schoolLabel}的专业`}>
        <Select
          onChange={(v) => {
            console.log(v);
            setMajor(majors.filter((m) => m.id === v)[0]);
          }}>
          {majors
            .filter((m) => m.name === school)
            .map((m) => (
              <Option value={m.id} key={m.id}>
                {m.major}
              </Option>
            ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default MajorPicker;
