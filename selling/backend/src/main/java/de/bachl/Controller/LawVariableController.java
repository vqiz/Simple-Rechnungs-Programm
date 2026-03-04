package de.bachl.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import de.bachl.db.interfaces.VariableRepository;

@Controller
public class LawVariableController {

    @Autowired
    private VariableRepository variableRepository;

    @QueryMapping
    public String getAgb() {
        return variableRepository.findById("agb").get().getValue();
    }

    @QueryMapping
    public String getDatenschutz() {
        return variableRepository.findById("datenschutz").get().getValue();
    }

    @QueryMapping
    public String getImpressum() {
        return variableRepository.findById("impressum").get().getValue();
    }

}
