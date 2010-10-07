package au.org.ala.collectory

import grails.converters.JSON

class Collection extends ProviderGroup implements Serializable {

    def idGeneratorService

    static final String ENTITY_TYPE = 'Collection'
    static final String ENTITY_PREFIX = 'co'

    String collectionType       // list of type of collection as JSON e.g ['live', 'preserved', 'tissue', 'DNA']
    String keywords
    String active               // see active vocab
    int numRecords = ProviderGroup.NO_INFO_AVAILABLE
                                // total number of records held that are able to be digitised
    int numRecordsDigitised = ProviderGroup.NO_INFO_AVAILABLE
                                // number of records that are digitised

    /* Coverage - What the collection covers */

    // Geographic Coverage
    String states               // states and territories that are covered by the collection - see state vocab
	String geographicDescription// a free text description of where the data relates to
	BigDecimal eastCoordinate = ProviderGroup.NO_INFO_AVAILABLE
                                // furthest point East for this collection in decimal degrees
	BigDecimal westCoordinate = ProviderGroup.NO_INFO_AVAILABLE
                                // furthest point West for this collection in decimal degrees
	BigDecimal northCoordinate = ProviderGroup.NO_INFO_AVAILABLE
                                // furthest point North for this collection in decimal degrees
	BigDecimal southCoordinate = ProviderGroup.NO_INFO_AVAILABLE
                                // furthest point South for this collection in decimal degrees

	//Temporal Coverage - Time period the collection covers	single_date	The single date that the collection covers
	String startDate            // the start date of the period the collection covers
	String endDate	            // the end date of the period the collection covers

	//Taxonomic - Taxonomic coverage
	String kingdomCoverage      // the higher taxonomy that the collection covers - see kingdom_coverage vocab
                                // a space-separated string that can contain any number of these values:
                                // Animalia Archaebacteria Eubacteria Fungi Plantae Protista
    String scientificNames      // as JSON array eg ["Insecta", "Arachnida"]

    String subCollections       // list of sub-collections as JSON

    // the owning institution
    Institution institution
    static belongsTo = Institution

    // maps to exactly one providerMap
    static hasOne = [providerMap: ProviderMap]

    static transients = ProviderGroup.transients + ['listOfCollectionCodesForLookup', 'listOfinstitutionCodesForLookup',
            'mappable','inexactlyMapped','attributionList']

    static mapping = {
        sort: 'name'
    }

    static collectionTypes = ["archival","art","audio","cellcultures","electronic","facsimiles","fossils","genetic",
                        "living","observations","preserved","products","taxonomic","texts","tissue","visual"]

    static kingdoms = ['Animalia', 'Archaebacteria', 'Eubacteria', 'Fungi', 'Plantae', 'Protista']

    static constraints = {
        collectionType(nullable: true, maxSize: 256,
                validator: { ct ->
                if (!ct) {return true}
                ct.each {
                    if (!Collection.collectionTypes.contains(it)) {return false}
                }
                return true
        })
        keywords(nullable:true, maxSize:1024)
        active(nullable:true, inList:['Active growth', 'Closed', 'Consumable', 'Decreasing', 'Lost', 'Missing', 'Passive growth', 'Static'])
        numRecords()
        numRecordsDigitised()
        states(nullable:true)
        geographicDescription(nullable:true)
        eastCoordinate(max:360.0, min:-360.0, scale:10)
        westCoordinate(max:360.0, min:-360.0, scale:10)
        northCoordinate(max:360.0, min:-360.0, scale:10)
        southCoordinate(max:360.0, min:-360.0, scale:10)
        startDate(nullable:true, maxSize:45)
        endDate(nullable:true, maxSize:45)
        kingdomCoverage(nullable:true, maxSize:1024,
            validator: { kc ->
                if (!kc) {
                    return true
                }
                boolean ok = true
                // split value by spaces
                kc.split(" ").each {
                    if (!kingdoms.contains(it)) {
                        ok = false  // return false does not work here!
                    }
                }
                return ok
            })
        scientificNames(nullable:true, maxSize:2048)
        subCollections(nullable:true, maxSize:4096)
        providerMap(nullable:true)
        institution(nullable:true)
    }

    /**
     * Returns sub-collections as a list of maps where each contains a name and a description.
     *
     * @return List<Map>
     */
    def listSubCollections() {
        def result = []
        if (subCollections) {
            JSON.parse(subCollections).each {
                result << [name: it.name, description: it.description]
            }
        }
        return result
    }

    /**
     * Returns collection types as a list of string.
     *
     * @return List<Map>
     */
    def listCollectionTypes() {
        if (!collectionType) {
            return []
        }
        return JSON.parse(collectionType).collect { it.toString() }
    }

    /**
     * Returns keywords as a list of string.
     *
     * @return List<Map>
     */
    def listKeywords() {
        if (!keywords) {
            return []
        }
        return JSON.parse(keywords).collect { it.toString() }
    }

    /**
     * Returns scientific names as a list of string.
     *
     * @return List<Map>
     */
    def listScientificNames() {
        if (!scientificNames) {
            return []
        }
        return JSON.parse(scientificNames).collect { it.toString() }
    }

    /*
     * Returns the list of collection codes that can be used to look up specimen records
     *
     * @return the list of codes - may be empty
     * @.history 2-8-2010 changed to use code/map tables
     */
    List<String> getListOfCollectionCodesForLookup() {
        if (providerMap) {
            return providerMap.getCollectionCodes()*.code
        } else {
            return []
        }
    }

    /**
     * Returns the list of provider codes for the institution. Used to look up specimen records.
     *
     * @return the list of codes - may be empty
     * @.history 2-8-2010 changed to use code/map tables
     */
    List<String> getListOfInstitutionCodesForLookup() {
        if (providerMap) {
            return providerMap.getInstitutionCodes()*.code
        } else {
            return []
        }
    }

    /**
     * Returns true only if there is a provider code mapping and that mapping is known to be inexact.
     *
     * @return
     */
    boolean isInexactlyMapped() {
        if (providerMap) {
            return !providerMap.isExact()
        }
        return false
    }

    /**
     * Returns a summary of the collection including:
     * - id
     * - name
     * - acronym
     * - lsid if available
     * - institution (id,uid, name & logo url) if available
     * - description
     * - provider codes for matching with biocache records
     *
     * @return CollectionSummary
     */
    CollectionSummary buildSummary() {
        CollectionSummary cs = init(new CollectionSummary()) as CollectionSummary
        if (institution) {
            cs.institution = institution.name
            cs.institutionId = institution.id
            cs.institutionUid = institution.uid
            if (institution.logoRef?.file) {
                cs.institutionLogoUrl = au.org.ala.collectory.Utilities.buildInstitutionLogoUrl(institution.logoRef.file)
            }
        }
        cs.derivedInstCodes = getListOfInstitutionCodesForLookup()
        cs.derivedCollCodes = getListOfCollectionCodesForLookup()
        return cs
    }

    /**
     * Returns true if:
     *  a) parent institution is a partner
     *  b) has membership of a collection network (hub) (assumed that all hubs are partners)
     *  c) has isALAPartner set
     *
     * NOTE: restriction on abstract methods
     */
    boolean isALAPartner() {
        if (institution?.isALAPartner()) {
            return true
        } else if (networkMembership != null && networkMembership != "[]") {
            return true
        } else {
            return this.isALAPartner
        }
    }

    /**
     * Returns true if the group can be mapped.
     *
     * Can be mapped if the collection or its institution have valid lat and long.
     * @return
     */
    boolean canBeMapped() {
        if (latitude != 0.0 && latitude != -1 && longitude != 0.0 && longitude != -1) {
            return true
        }
        // use parent institution if lat/long not defined
        if (institution && institution.latitude != 0.0 && institution.latitude != -1 &&
                institution.longitude != 0.0 && institution.longitude != -1) {
            return true
        }
        return false
    }

    Map inheritedLatLng() {
        if (institution && institution.latitude != 0.0 && institution.latitude != -1 &&
                institution.longitude != 0.0 && institution.longitude != -1) {
            return [lat: institution.latitude, lng: institution.longitude]
        }
        return [:]
    }

    def List<Attribution> getAttributionList() {
        List<Attribution> list = super.getAttributionList();
        // add institution
        if (institution) {
            list << new Attribution(name: institution.name, url: institution.websiteUrl, uid: institution.uid)
        }
        return list
    }

    long dbId() { return id }

    String entityType() {
        return ENTITY_TYPE
    }
}
