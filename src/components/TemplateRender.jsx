import { useParams } from "react-router-dom";
import templates from "../data/templates";

const TemplateRender = ({formData, dynamicNavigation}) => {
    const {id}=useParams();
const selectedTemplate = templates.find((t) => t.id === Number(id)) || templates[0];

  return <selectedTemplate.component formData={formData} dynamicNavigation={dynamicNavigation}/>;}
export default TemplateRender;