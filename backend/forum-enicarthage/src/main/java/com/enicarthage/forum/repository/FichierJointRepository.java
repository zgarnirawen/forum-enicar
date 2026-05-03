package com.enicarthage.forum.repository;
import com.enicarthage.forum.model.FichierJoint;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FichierJointRepository extends JpaRepository<FichierJoint, Long> {
    List<FichierJoint> findByTacheId(Long tacheId);
}
