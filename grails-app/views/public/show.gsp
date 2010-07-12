<%@ page import="au.org.ala.collectory.ProviderGroup; au.org.ala.collectory.InfoSource" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="ala" />
        <title>${fieldValue(bean: collectionInstance, field: "name")}</title>
        <g:javascript src="jquery.fancybox/fancybox/jquery.fancybox-1.3.1.pack.js" />
        <link rel="stylesheet" type="text/css" href="${resource(dir:'js/jquery.fancybox/fancybox',file:'jquery.fancybox-1.3.1.css')}" media="screen" />
        <script type="text/javascript">
          $(document).ready(function() {
            $('#nav-tabs > ul').tabs();

            $("a#lsid").fancybox({
                    'hideOnContentClick' : false,
                    'titleShow' : false,
                    'autoDimensions' : false,
                    'width' : 600,
                    'height' : 180
                });
          });
        </script>
    </head>
    <body>
      <div id="content">
        <div id="header" class="taxon" style="margin-bottom:15px;">
          <div class="section full-width">
            <div class="hrgroup col-9">
                <h1 class="family"><i>${fieldValue(bean:collectionInstance,field:'name')}</i></h1>
                <h2>${collectionInstance.findPrimaryInstitution()?.name}</h2>
                <cite><a href="#lsidText" id="lsid" class="local" title="Life Science Identifier (pop-up)">LSID</a></cite>
                <div style="display:none; text-align: left;">
                    <div id="lsidText" style="text-align: left;">
                        <b><a href="http://lsids.sourceforge.net/" target="_blank">Life Science Identifier (LSID):</a></b>
                        <p style="margin: 10px 0;"><cl:guid target="_blank" guid='${fieldValue(bean: collectionInstance, field: "guid")}'/></p>
                        <p style="font-size: 12px;">LSIDs are persistent, location-independent,resource identifiers for uniquely naming biologically
                             significant resources including species names, concepts, occurrences, genes or proteins,
                             or data objects that encode information about them. To put it simply,
                            LSIDs are a way to identify and locate pieces of biological information on the web. </p>
                    </div>
                </div>
            </div>
            <div class="aside col-3">
              <!-- institution -->
              <g:set var="institution" value="${collectionInstance.findPrimaryInstitution()}"/>
              <g:if test="${institution}">
                <g:if test="${fieldValue(bean: institution, field: 'logoRef') && fieldValue(bean: institution, field: 'logoRef.file')}">
                  <img style="margin-bottom: 5px; margin-right:20px; float:right;" src='${resource(absolute:"true", dir:"data/institution/",file:fieldValue(bean: institution, field: 'logoRef.file'))}' />
                  <!--div style="clear: both;"></div-->
                </g:if>
                <g:else>
                  <p class='subhead-link'><g:link controller="public" action="showInstitution" id="${institution.id}">${fieldValue(bean: institution, field: "name")}</g:link></p>
                </g:else>
              </g:if>
            </div>
          </div>
          <div id="nav-tabs">
            <ul class="ui-tabs-nav">
                <li class="ui-tabs-selected"><a href="#overview">Overview</a></li>
                <li><a href="#statistics">Statistics</a></li>
                <li><a href="#records">Records</a></li>
            </ul>
          </div>
        </div><!--close header-->
        <div id="overview" class="ui-tabs-panel">
          <div id="column-one">
            <div class="section no-margin-top">
              <h3>Description</h3>
              <p><cl:formattedText>${fieldValue(bean: collectionInstance, field: "pubDescription")}</cl:formattedText></p>
              <p><cl:formattedText>${fieldValue(bean: collectionInstance, field: "techDescription")}</cl:formattedText></p>
              <cl:temporalSpan start='${fieldValue(bean: collectionInstance, field: "scope.startDate")}' end='${fieldValue(bean: collectionInstance, field: "scope.endDate")}'/>

              <h3>Taxonomic range</h3>
              <g:if test="${fieldValue(bean: collectionInstance, field: 'focus')}">
                <p><cl:formattedText>${fieldValue(bean: collectionInstance, field: "focus")}</cl:formattedText></p>
              </g:if>
              <g:if test="${fieldValue(bean: collectionInstance, field: 'scope.kingdomCoverage')}">
                <p>Kingdoms covered include: ${fieldValue(bean: collectionInstance, field: "scope.kingdomCoverage")}</p>
              </g:if>
              <g:if test="${fieldValue(bean: collectionInstance, field: 'scope.scientificNames')}">
                <p>Specimens in the ${collectionInstance.name} include members from the following taxa:<br/>
                <cl:JSONListAsList json='${fieldValue(bean: collectionInstance, field: "scope.scientificNames")}'/></p>
              </g:if>

              <h3>Geographic range</h3>
              <g:if test="${fieldValue(bean: collectionInstance, field: 'scope.geographicDescription')}">
                <p>${fieldValue(bean: collectionInstance, field: "scope.geographicDescription")}</p>
              </g:if>
              <g:if test="${fieldValue(bean: collectionInstance, field: 'scope.states')}">
                <p><cl:stateCoverage states='${fieldValue(bean: collectionInstance, field: "scope.states")}'/></p>
              </g:if>
              <g:if test="${collectionInstance.scope.westCoordinate != -1}">
                <p>The western most extent of the collection is: <cl:showDecimal value='${collectionInstance.scope?.westCoordinate}' degree='true'/></p>
              </g:if>
              <g:if test="${collectionInstance.scope.eastCoordinate != -1}">
                <p>The eastern most extent of the collection is: <cl:showDecimal value='${collectionInstance.scope?.eastCoordinate}' degree='true'/></p>
              </g:if>
              <g:if test="${collectionInstance.scope.northCoordinate != -1}">
                <p>The northtern most extent of the collection is: <cl:showDecimal value='${collectionInstance.scope?.northCoordinate}' degree='true'/></p>
              </g:if>
              <g:if test="${collectionInstance.scope.southCoordinate != -1}">
                <p>The southern most extent of the collection is: <cl:showDecimal value='${collectionInstance.scope?.southCoordinate}' degree='true'/></p>
              </g:if>

              <!--h3>Geological age</h3-->

              <h3>Number of specimens in the collection</h3>
              <g:if test="${fieldValue(bean: collectionInstance, field: 'scope.numRecords') != '-1'}">
                <p>The estimated number of specimens within the ${collectionInstance.name}: ${fieldValue(bean: collectionInstance, field: "scope.numRecords")}.</p>
              </g:if>

              <g:if test="${fieldValue(bean: collectionInstance, field: 'scope.numRecordsDigitised') != '-1'}">
                <h3>Number of digitised specimens</h3>
                <p>Of these ${fieldValue(bean: collectionInstance, field: "scope.numRecordsDigitised")} are digitised.
                This represents <cl:percentIfKnown dividend='${collectionInstance.scope?.numRecordsDigitised}' divisor='${collectionInstance.scope?.numRecords}' /> of the collection.</p>
              </g:if>

              <g:if test="${collectionInstance.scope.listSubCollections()?.size() > 0}">
                <h3>Sub-collections</h3>
                <p>The <cl:collectionName name="${collectionInstance.name}"/> contains these significant collections:</p>
                <g:each var="sub" in="${collectionInstance.scope.listSubCollections()}" >
                  <p class="sub"><cl:subCollectionDisplay sub="${sub}"/></p>
                </g:each>
              </g:if>
            </div><!--close section-->
          </div><!--close column-one-->

          <div id="column-two">
            <div class="section sidebar">
              <div>
                <g:if test="${fieldValue(bean: collectionInstance, field: 'imageRef') && fieldValue(bean: collectionInstance, field: 'imageRef.file')}">
                  <img alt="${fieldValue(bean: collectionInstance, field: "imageRef.file")}"
                          src="${resource(absolute:"true", dir:"data/collection/", file:collectionInstance.imageRef.file)}" />
                  <p class="caption">${fieldValue(bean: collectionInstance, field: "imageRef.caption")}</p>
                  <p class="caption">${fieldValue(bean: collectionInstance, field: "imageRef.attribution")}</p>
                  <p class="caption">${fieldValue(bean: collectionInstance, field: "imageRef.copyright")}</p>
                </g:if>
              </div>

              <h4>Location</h4>
              <!-- use parent location if the collection is blank -->
              <g:set var="address" value="${collectionInstance.address}"/>
              <g:if test="${address == null || address.isEmpty()}">
                <g:if test="${collectionInstance.findPrimaryInstitution()}">
                  <g:set var="address" value="${collectionInstance.findPrimaryInstitution().address}"/>
                </g:if>
              </g:if>

              <cl:ifNotBlank value='${address?.street}'/>
              <cl:ifNotBlank value='${address?.postBox}'/>
              <cl:ifNotBlank value="${address?.city}" value2="${address?.state}" value3="${address?.postcode}" join=" "/>
              <cl:ifNotBlank value='${address?.country}'/>

              <cl:ifNotBlank value='${fieldValue(bean: collectionInstance, field: "email")}'/>
              <cl:ifNotBlank value='${fieldValue(bean: collectionInstance, field: "phone")}'/>

              <g:set var="contact" value="${collectionInstance.getPrimaryContact()}"/>
              <g:if test="${contact}">
                <h4>Contact</h4>
                  <p class="contactName">${contact?.contact?.buildName()}</p>
                  <p>${contact?.role}</p>
                  <cl:ifNotBlank prefix="phone: " value='${fieldValue(bean: contact, field: "contact.phone")}'/>
                  <cl:ifNotBlank prefix="fax: " value='${fieldValue(bean: contact, field: "contact.fax")}'/>
                  <p>email: <cl:emailLink>${contact?.contact?.email}</cl:emailLink></p>
              </g:if>

              <!-- web site -->
              <g:if test="${collectionInstance.websiteUrl}">
                <h4>Web site</h4>
                <div class="webSite">
                  <a class='external_icon' target="_blank" href="${collectionInstance.websiteUrl}">Visit the collection's website</a>
                </div>
              </g:if>

              <!-- network membership -->
              <g:if test="${collectionInstance.networkMembership}">
                <h4>Membership</h4>
                <g:if test="${collectionInstance.isMemberOf('CHAEC')}">
                  <p>Member of Council of Heads of Australian Entomological Collections (CHAEC)</p>
                  <img src="${resource(absolute:"true", dir:"data/network/",file:"butflyyl.gif")}"/>
                </g:if>
                <g:if test="${collectionInstance.isMemberOf('CHAH')}">
                  <p>Member of Council of Heads of Australasian Herbaria (CHAH)</p>
                  <a target="_blank" href="http://www.chah.gov.au"><img src="${resource(absolute:"true", dir:"data/network/",file:"CHAH_logo_col_70px_white.gif")}"/></a>
                </g:if>
                <g:if test="${collectionInstance.isMemberOf('CHAFC')}">
                  <p>Member of Council of Heads of Australian Faunal Collections (CHAFC)</p>
                </g:if>
                <g:if test="${collectionInstance.isMemberOf('AMRRN')}">
                  <p>Member of Australian Microbial Resources Reseach Network (AMRRN)</p>
                  <img src="${resource(absolute:"true", dir:"data/network/",file:"amrrnlogo.png")}"/>
                </g:if>
              </g:if>
              </div>
              </div>
            </div><!--overview-->
            <div id="statistics" class="ui-tabs-panel ui-tabs-hide">
            </div>
            <div id="records" class="ui-tabs-panel ui-tabs-hide">
              <div class="section">
                <h2>Digitised specimen records</h2>
                <g:if test="${numBiocacheRecords != -1}">
                  <p>The ALA holds <cl:numberOf number="${numBiocacheRecords}" noun="specimen record"/> for the ${cl.collectionName(name: collectionInstance.name)}.</p>
                </g:if>
                <cl:recordsLink
                        institutionCodes="${collectionInstance.getListOfInstitutionCodesForLookup()}"
                        collectionCodes="${collectionInstance.getListOfCollectionCodesForLookup()}">
                  Click to view records for the ${cl.collectionName(name: collectionInstance.name)}.
                </cl:recordsLink>
                <p></p>
                <p></p>
              </div>
            </div>
          </div>
    </body>
</html>
