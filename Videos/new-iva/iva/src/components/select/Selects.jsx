import Select from "react-select"
const Selects = (props) => {
  return (
    <Select placeholder={props.placeholder} onChange={props.onChange} menuPlacement="auto"    menuPosition="absolute"   menuPortalTarget={document.body} options={props.option} styles={props.styles} />
  )
}

export default Selects
