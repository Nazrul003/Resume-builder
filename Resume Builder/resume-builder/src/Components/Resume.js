import React from "react";
import { useState } from "react";
import jsPDF from "jspdf";
export const Resume = () => {
  // State for form data including dynamic sections
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    experience: '',
    sections: [] // Array for dynamic sections
  });

  // Handle change in input fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle changes in dynamic sections only in Content not in heading
  const handleSectionChange = (index, e) => {            // here we are handling section change
    const newSections = [...formData.sections];          // we are copying section[] in newSection
    newSections[index].content = e.target.value;         // chnaging content(object) of respective index
    setFormData({ ...formData, sections: newSections }); // we are copying newSection[] to section[]
  };

  // Add a new section
  const addSection = (heading) => {
    if(formData.sections.length>0&&(formData.sections[formData.sections.length-1].heading===''
      ||formData.sections[formData.sections.length-1].content==='')
    )
    {
      return;
    }
    setFormData({
      ...formData,
      sections: [...formData.sections, { heading, content: '' }]// here ...formdata.section is including all the
    });                                                         // value of section array that are present
  };                                                            // and then we are addding a new object
                                                                // { heading, content: '' }


  // Remove a section
  // filtering out respective index of section array
  const removeSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index); 
    setFormData({ ...formData, sections: newSections });
  };

  // Generate and download PDF
  const downloadPDF = () => {
    const pdf = new jsPDF();
    let y = 20;
    const lineWidth = 0.2;
    const lineHeight = 7;

    // Add Name
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text(formData.name, 15, y);
    y += 15;

    // Add Email
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(`Email: ${formData.email}`, 15, y);
    pdf.setLineWidth(lineWidth);
    //pdf.line(starting X axis,starting Y axis, endeing X axis, ending Y axis)
    pdf.line(15, y + 1.5, pdf.internal.pageSize.width - 15, y + 1.5);//pdf.internal.pageSize.width :- how much width a page is having
    y += 10;                                           

    // Add Phone
    pdf.setFont("helvetica", "bold");
    pdf.text(`Phone: ${formData.phoneNo}`, 15, y);
    pdf.setLineWidth(lineWidth);
    pdf.line(15, y + 1.5, pdf.internal.pageSize.width - 15, y + 1.5);
    y += 10;

    // // Add Address
    // pdf.setFont("helvetica", "bold");
    // pdf.text(`Address: ${formData.address}`, 15, y);
    // pdf.setLineWidth(lineWidth);
    // pdf.line(15, y + 1.5, pdf.internal.pageSize.width - 15, y + 1.5);
    // y += 10;

    // Add Experience
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text('Experience', 15, y);
    pdf.setLineWidth(lineWidth);
    pdf.line(15, y + 1.5, pdf.internal.pageSize.width - 15, y + 1.5);
    y += 10;

    pdf.setFontSize(14);
    pdf.setFont("helvetica", "normal");
    const experienceLines = pdf.splitTextToSize(formData.experience, 190);
    pdf.text(experienceLines, 15, y);
    y += experienceLines.length * lineHeight;
    pdf.setLineWidth(lineWidth);

    
     // Adding dynamic section title
    formData.sections.forEach(section => {
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text(section.heading, 15, y);
      pdf.setLineWidth(lineWidth);
      pdf.line(15, y + 1.5, pdf.internal.pageSize.width - 15, y + 1.5);
      y += 10;
     
      // Adding dynamic section content
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "normal");
      const sectionLines = pdf.splitTextToSize(section.content, 190);
      pdf.text(sectionLines, 15, y);
      y += sectionLines.length * lineHeight;
    });

    pdf.save('resume.pdf');
  };

  return (
    <div className="Containor">
      <form>
        <h2>Resume Builder</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phoneNo"
          placeholder="Contact no"
          value={formData.phoneNo}
          onChange={handleChange}
        />
   {/*     <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        /> */}
        <textarea
          name="experience"
          placeholder="Experience"
          value={formData.experience}
          onChange={handleChange}
        />
        
        {/* Dynamic Sections */}
        <h3>Dynamic Sections</h3>
        {formData.sections.map((section, index) => (
          <div key={index} >
            <input
              type="text"
              value={section.heading}
              onChange={(e) => {
                const newSections = [...formData.sections];
                newSections[index].heading = e.target.value;
                setFormData({ ...formData, sections: newSections });
              }}
              placeholder={`Name of the heading`}
            />
            <textarea
              value={section.content}
              onChange={(e) => handleSectionChange(index, e)}
              placeholder={`Content for ${section.heading===''?'heading':section.heading}`}
            />
            <button type="button" onClick={() => removeSection(index)}>
              Remove Section
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addSection('')}>
          Add Section
        </button>
      </form>

      <div className="Resume-Prev">
        <h2>Resume Preview</h2>
        <p><strong>{formData.name || 'Name'}</strong></p>
        <p><strong>Email :</strong> {formData.email}</p>
        <p><strong>Contact no :</strong> {formData.phoneNo}</p>
       {/* <p><strong>Address :</strong> {formData.address}</p> */}
        <p><strong>Experience :</strong> {formData.experience}</p>
        <div id="Dynamic">
          <p><strong>Dynamic Sections:</strong></p>
          {formData.sections.map((section, index) => (
            <div key={index}>
              <h4>{section.heading}</h4>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
        <button onClick={downloadPDF}>Download resume</button>
      </div>
    </div>
  );
};
