    %%[ 
      SET @subscriberKey = 'raulnabarret@gmail.com' 
     
    ]%%

    <script runat="server" language="JavaScript">
      Platform.Load("core","1.1.2");

      var subscriptionStatus = Subscriber.Retrieve({
        Property: "SubscriberKey",
        SimpleOperator: "equals",
        Value: Variable.GetValue("@subscriberKey")
      });

      if(subscriptionStatus[0].Status == "Active") {
        Variable.SetValue("subscriptionStatus", true);
      } else {
        Variable.SetValue("subscriptionStatus", false);
      }
    
      // POST VARIABLES
      var subscriberKey = Platform.Request.GetFormField('subscriberKey') || "";    
      var email = Platform.Request.GetFormField('email') || "";
      var quarterlyNewsletter = Platform.Request.GetFormField('quarterlyNewsletter') || false; 
      var unsubscribe = Platform.Request.GetFormField('unsubscribe') || false;
      var subscribeTo = Platform.Request.GetFormField('subscribe') || false;

      if(subscriberKey) {
        var subscriberData = {
          "Attributes": {
            "Preference" : preference,
            "Connection" : connection,
            "Send Email Newsletter" : quarterlyNewsletter
          }
        };

        if(gender != "") {
          subscriberData.Attributes.Gender = gender;
        }

        if(subscribeTo) {
          subscriberData.Status = "Active";
        }


        var quarterlyNewsletterList = List.Init("Quarterly Newsletter");
        var status = quarterlyNewsletterList.Subscribers.Add("raulnabarret@gmail.com");

        var subObj = Subscriber.Init(subscriberKey);

        if(unsubscribe) {
          var unsubscribeSatus = subObj.Unsubscribe();
          Variable.SetValue("unsubscribeSatus", unsubscribeSatus);
        } else {
          var updateStatus = subObj.Update(subscriberData);
          Variable.SetValue("unsubscribeSatus", (subscribeTo && updateStatus)?"SUBSCRIBED":"NA");
          Variable.SetValue("updateStatus", updateStatus);
        }
        
        Variable.SetValue("formSubmitted", true);
      } else {
        Variable.SetValue("formSubmitted", false);
      }
    </script>

    <form method="POST">
      <input type="hidden" name="subscriberKey" value="%%=v(@subscriberkey)=%%">
      
      <h2>Update your profile:</h2>
      <label>* Email: </label><input type="email" required name="email" value="%%=v(@emailAddress)=%%"><br>

            
      <h2>Update your subscriptions:</h2>
      <label>Quarterly Newsletter: </label><input name="quarterlyNewsletter" value="true" type="checkbox" checked><br>

      <br/> <br/>

      <label>%%=IIF(@subscriptionStatus, "Unsubscribe from all", "Resubscribe")=%%</label>
      <input name='%%=IIF(@subscriptionStatus, "unsubscribe", "subscribe")=%%' value="true" type="checkbox"><br>
      (You are %%=IIF(@subscriptionStatus, "subscribed to", "unsubscribed from")=%% us!)

      <br/> <br/>

      <input type="submit" value="Update">

    </form>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10.3.5/dist/sweetalert2.all.min.js"></script>

    %%[ IF @formSubmitted AND @updateStatus == "OK" AND @unsubscribeSatus == "NA" THEN ]%%
        <script>
          Swal.fire("Updated!", "Your preferences are updated successfully", "success").then(() => {
            location.href = location.href;
          });
        </script>
    %%[ ELSEIF @formSubmitted AND @updateStatus != "OK" AND @unsubscribeSatus == "NA" THEN ]%%
        <script>
          Swal.fire("Not Updated!", "Something went wrong while updating your preferences", "error").then(() => {
            location.href = location.href;
          });
        </script>
    %%[ ELSEIF @formSubmitted AND @unsubscribeSatus == "OK" THEN ]%%
        <script>
          Swal.fire("Unsubscribed!", "Sorry to see you go away!", "info").then(() => {
            location.href = location.href;
          });
        </script>
    %%[ ELSEIF @formSubmitted AND @unsubscribeSatus == "SUBSCRIBED" THEN ]%%
        <script>
          Swal.fire("Subscribed!", "Happy to see you again!<br/>We make sure we don't spam you!!", "success").then(() => {
            location.href = location.href;
          });
        </script>
    %%[ ELSE ]%%
    %%[ ENDIF ]%%