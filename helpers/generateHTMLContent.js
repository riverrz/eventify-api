const newEventEmailContent = (
  { title, description, startTimeStamp, endTimeStamp },
  sender
) => {
  return {
    subject: `Participation link to join the event ${title}`,
    genHtml: (token) => `
            <div>
                You have been sent an invitation by ${sender} for the following event:
                <ul>
                    <li>Title: ${title}</li>
                    <li>Description: ${description}</li>
                    <li>Start Date: ${startTimeStamp.toLocaleString()}</li>
                    <li>End Date: ${endTimeStamp.toLocaleString()}</li>
                </ul>
            </div>
            <p>Your unique participation id for the event is: </p>
            <strong>${token}</strong>
        `,
  };
};

const reminderEmailContent = (
  { title, description, startTimeStamp, endTimeStamp },
  recipient
) => {
  return {
    subject: `Reminder for the event ${title}`,
    html: `
            <div>
                Hi, <strong>${recipient}</strong>! We hope you haven't forgotten about <strong>${title}</strong>.
                Given below are the details for the event for your reference: 
                <ul>
                    <li>Title: ${title}</li>
                    <li>Description: ${description}</li>
                    <li>Start Date: ${startTimeStamp.toLocaleString()}</li>
                    <li>End Date: ${endTimeStamp.toLocaleString()}</li>
                </ul>
            </div>
        `,
  };
};

exports.newEventEmailContent = newEventEmailContent;
exports.reminderEmailContent = reminderEmailContent;
