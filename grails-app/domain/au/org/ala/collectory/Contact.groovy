package au.org.ala.collectory
/*  represents a person who acts as a contact for an ALA entity such as
 *  an institution, collection or dataset.
 *
 *  - based on collectory data model version 5
 */
class Contact {

    String title            // the person's honorific eg Dr
    String firstName
    String lastName
    String phone
    String mobile
    String email
    String fax
    String notes
    boolean publish         // controls whether the contact is listed on web site

    //static hasMany = {groups: ProviderGroup}    // the groups this is a contact for

    //static belongsTo = ProviderGroup            // this means the ProviderGroup is responsible for persisting
                                      // relationships and only the ProviderGroup can cascade saves

    static constraints = {
        title(nullable:true, maxSize: 10, inList: ["Dr", "Prof", "Mr", "Ms", ""])
        firstName(nullable: true, maxSize: 255)
        lastName(nullable: true, maxSize: 255)
        phone(nullable: true, maxSize:45)
        mobile(nullable: true, maxSize:45)
        email(nullable: true, email: true)
        fax(nullable: true, maxSize:45)
        notes(nullable: true, maxSize: 1024)
        publish()
    }

    def print() {
        ["title: " + title,
         "firstName: " + firstName,
         "lastName: " + lastName,
         "phone: " + phone,
         "mobile: " + mobile,
         "email: " + email,
         "fax: " + fax,
         "notes: " + notes,
         "publish " + publish]
    }

    /**
     * Loads a name that comes as a single string. Only handles simple cases.
     */
    void parseName(String name) {
        def parts = name.split()
        switch (parts.size()) {
            case 0: break // bad
            case 1:
                lastName = name // only one word so make it last name
                break
            case 2:              // assume first + last
                firstName = parts[0]
                lastName = parts[1]
                break
            default:
                // cater for Dr Lemmy Caution and Lemmy A Caution
                /* Algorithm is:
                    - make first part the title if it is recognised
                    - make the last part the last name
                    - dump all the remaining parts into first name
                 */
                if (parts[0] in ["Dr", "Prof", "Mr", "Ms", ""]) {
                    title = parts[0]
                    firstName = parts[1..parts.size() - 2].join(" ")
                } else {
                    title = ''
                    firstName = parts[0..parts.size() - 2].join(" ")
                }
                lastName = parts[parts.size() - 1]
                break
        }
    }

    String buildName() {
        if (lastName)
            return [(title ? title : ''), firstName, lastName].join(" ").trim()
        else if (email)
            return email
        else if (phone)
            return phone
        else if (mobile)
            return mobile
        else if (fax)
            return fax
        else
            return ''
    }

    /**
     * Quick test to see if an instance has any content.
     *
     * Note stupid name because Grails seems to object to isEmpty thinking there should be an empty property.
     */
    boolean hasContent() {
        lastName || phone || mobile || email || fax
    }
}
