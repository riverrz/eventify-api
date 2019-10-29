module.exports = (
  { title, description, startTimeStamp, endTimeStamp },
  sender
) => {
  return {
    subject: `Participation link to join the event ${title}`,
    genHtml: token => `
            <div>
                You have been sent an invitation by ${sender} for the following event:
                <ul>
                    <li>Title: ${title}</li>
                    <li>Description: ${description}</li>
                    <li>Start Date: ${startTimeStamp.toDateString()}</li>
                    <li>End Date: ${endTimeStamp.toDateString()}</li>
                </ul>
            </div>
            <p>Your unique participation id for the event is: </p>
            <strong>${token}</strong>
        `
  };
};
