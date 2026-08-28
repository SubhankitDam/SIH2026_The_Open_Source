## Project Summary

(_These points were discussed during a group call on Thursday, 27th August 2026 21:28_)

The application will have 4 different IDs based on authority:
1. Patient / User ID
2. Nurse ID
3. Doctor ID
4. Admin ID

**Solutions Proposed:**
Every rural area has their own local doctors. They all write prescriptions with varying
writing styles. (Solutions 1 and 2 proposed for this problem)
1. Interconnect all the government hospitals with a common database stored in our main servers
2.  Detailed summary generation of the prescriptions and medical history of patients
3.  Let users select what medicines they want to repurchase on the website
    (**keeping in mind that majority people in India don't know too much jargon**)
4.  Use AI to upscale poor resolution images of prescriptions to understand patient details
(as most of the users in India can't afford even middle-budget phones)

### ID Roles

* **Patient ID:**<br>
Every patient will have a unique ID generated either by a doctor or by themselves
via our web application.


* **Nurse ID:**<br>
Nurse can access the database of patients only when they enter the patient's ID as well as
their corresponding Doctor's ID. Their job is to supply the necessary medicines to the
patient. And in case the medicine's not available or any other inconvenience,
the patient must be notified appropriately.


* **Doctor's ID:**<br>
Doctor's can access a patient's record only when they get authorization
<span style="color: #ff0000; font-weight: 700">(from whom? The Admin or their respective
Hospital, or perhaps both?)</span> and their ID.<br>
Nurse will request for approval for another company's medicine of same composition in case
that medicine is not available at the moment. If the doctor approves, then only the
respective nurse can proceed further.<br><br>
\***If the case is resolved, the doctor cannot access the patient's records any further.**\*


* **Admin ID:**<br>
Admin ID will be with us. We can of course see every record of the doctors, nurses and the
patients in each hospital.

### <u>Emergency Situations</u>
If a patient cannot communicate with any doctor because of an accident or any other reason,
doctors can apply for a special case for that patient which will only be accessible
by the nurses, doctors, and the admin.<br>
After the emergency situation is resolved, the patient will be handed their
newly created ID (if one wasn't already there) and temporary password
that they must reset after their initial login.

### Security
* **Password Aging:**<br>
automatically prompt the user to change their password after some days
(_45 - 60 days probably??_)
* **Revoke Screenshots:**<br>
Revoke the ability to take screenshots of the website / application
* **Session timeout for initial security of the website**

### Sudip's Problem (Mentioned in the group call)
* **Password not matching:** when doing a hackathon project in his school
(a pretty common problem in many sites actually).
