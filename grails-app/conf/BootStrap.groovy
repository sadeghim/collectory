import au.org.ala.collectory.ProviderGroup
import au.org.ala.collectory.Image
import au.org.ala.collectory.Contact
import grails.util.GrailsUtil
import grails.converters.JSON
import au.org.ala.custom.marshalling.DomainClassWithUidMarshaller

class BootStrap {

    def grailsApplication
    def dataLoaderService
    def authenticateService

    def init = { servletContext ->
        // custom marshaller to put UID into the JSON representation of associations
        JSON.registerObjectMarshaller( new DomainClassWithUidMarshaller(false, grailsApplication), 2)
    }

    def destroy = {
    }
}