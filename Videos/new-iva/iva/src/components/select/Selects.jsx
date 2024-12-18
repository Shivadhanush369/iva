import Select from "react-select"
const Selects = (props) => {
  return (
    <Select  onChange={props.onChange}  options={props.option} styles={props.styles} />
  )
}

export default Selects
